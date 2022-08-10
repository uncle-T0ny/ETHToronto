import {assert, call, near, NearBindgen, NearContract, UnorderedMap, view} from 'near-sdk-js'

/*
smart contract features:
- create a volunteer group with the information √
- receive usn deposit to some volunteer’s proposal √
- send the funds and allocate voting points between the users based on their deposits √
- allow increasing or decrease volunteer’s group reputation based on voting points √
- allow to withdraw the funds (usn) √
- create a proposal: required usn amount, group id √
 */

@NearBindgen
class MelanieCore extends NearContract {
  groups: UnorderedMap;
  proposals: UnorderedMap;
  depositTokenId: string;

  constructor({deposit_token_id}: { deposit_token_id: string }) {
    super()
    this.groups = new UnorderedMap("groups");
    this.proposals = new UnorderedMap("proposals");
    this.depositTokenId = deposit_token_id;
  }

  @view
  getDepositTokenId() {
    return this.depositTokenId;
  }

  @call
  addGroup({
             groupUuid,
             group: {
               title,
               description,
               logoUrl
             }
           }: { groupUuid: string, group: Pick<VolunteerGroup, 'title' | 'description' | 'logoUrl'> }) {
    assert(this.groups.get(groupUuid) !== undefined, "Group already exists");

    const group = new VolunteerGroup(
      groupUuid,
      title,
      description,
      logoUrl
    );
    this.groups.set(groupUuid, group);

    near.log(`Group ${title} added`)
  }


  @view
  getGroups() {
    return this.groups.toArray().map(([key, group]: [string, VolunteerProposal]) => ({
      uuid: key,
      ...group
    }));
  }

  @view
  getProposals() {
    near.log(this.proposals.toArray());
    return [];
    // return this.proposals.toArray().map(([key, proposal]: [string, VolunteerProposal]) => {
    //   const currentAmount = Object.values(proposal.amounts)
    //     .map((a: string) => BigInt(a))
    //     .reduce((acc, cur) => acc + cur, BigInt(0)).toString();
    //   return {
    //     uuid: key,
    //     currentAmount,
    //     ...proposal
    //   };
    // });
  }

  @call
  voteGroupUp(uuid: string) {
    const group = this.groups.get(uuid) as VolunteerGroup;
    assert(!!group, "Group does not exist");
    group.voteUp(near.predecessorAccountId());
    this.groups.set(uuid, group);
  }

  @call
  voteGroupDown(uuid: string) {
    const group = this.groups.get(uuid) as VolunteerGroup;
    assert(!!group, "Group does not exist");
    group.voteDown(near.predecessorAccountId());
    this.groups.set(uuid, group);
  }

  @call
  addProposal({uuid, proposal : {
    groupUuid,
    requiredAmount,
    title,
    description,
    imageUrls
  }} : { uuid: string, proposal: Pick<VolunteerProposal, 'requiredAmount' | 'groupUuid' | 'title' | 'description' | 'imageUrls'>}) {
    const group = this.groups.get(groupUuid) as VolunteerGroup;

    // Check if group exists
    assert(!!group, `Group with id ${groupUuid} does not exist`);

    // Check that account is owner of group
    assert(group.owner === near.signerAccountId(), "Only owner can add proposal");

    // Check that proposal does not exist
    assert(!this.proposals.get(uuid), "Proposal already exists");

    this.proposals.set(uuid, new VolunteerProposal(
      uuid,
      groupUuid,
      requiredAmount,
      title,
      description,
      imageUrls
    ));

    near.log(`Proposal ${title} added`)
  }

  @call
  ft_on_transfer({sender_id, amount, msg}) {
    near.log(`Transfer from ${sender_id} of ${amount} ${near.predecessorAccountId()}, msg: ${msg}`);
    const proposalUuid: string = JSON.parse(msg).proposal_uuid;
    const proposal = this.proposals.get(proposalUuid) as VolunteerProposal;
    const group = this.groups.get(proposal.groupUuid) as VolunteerGroup;

    // Check that token is deposit token
    assert(this.depositTokenId === near.predecessorAccountId(), "Token is not supported to deposit");

    // Check if proposal exists
    assert(!!proposal, "Proposal does not exist");

    // Check if group exists
    assert(!!group, "Group does not exist");

    // Check if proposal is open
    assert(proposal.status === "open", "Proposal is not open");

    // Fund amount
    proposal.fund(sender_id, amount);

    // Check if proposal has required amount of funds
    if (proposal.hasRequiredAmount()) {
      // Accept current proposal
      proposal.accept();

      // Save proposal changes
      this.proposals.set(proposalUuid, proposal);

      // Allocate rate points
      group.allocatePoints(proposal.getAllAmounts());

      // Save group changes
      this.groups.set(proposal.groupUuid, group);
    }

    return '0';
  }

  @call
  withdraw_proposal_funds(uuid: string) {
    const proposal = this.proposals.get(uuid) as VolunteerProposal;
    const group = this.groups.get(proposal.groupUuid) as VolunteerGroup;

    // Check if proposal exists
    assert(!!proposal, "Proposal does not exist");

    // Check if group exists
    assert(!!group, "Group does not exist");

    // Check that account is owner of group
    assert(group.owner === near.signerAccountId(), "Only owner can withdraw proposal funds");

    // Check that proposal is accepted
    assert(proposal.status === "accepted", "Proposal is not accepted");

    // Check that proposal has balance
    assert(BigInt(proposal.balance) > 0, "Proposal has no balance");

    // Transfer proposal balance to owner
    const promise = near.promiseBatchCreate(this.depositTokenId);
    const params = {receiverId: near.signerAccountId(), amount: proposal.balance};

    // Reset proposal balance
    proposal.balance = "0";
    this.proposals.set(uuid, proposal);

    near.promiseBatchActionFunctionCall(promise, 'ft_transfer', JSON.stringify(params), 0, 5000000000000);

    // Return promise
    return near.promiseReturn(promise);
  }


  default() {
    return new MelanieCore({deposit_token_id: ""})
  }
}

class VolunteerGroup {
  title: string;
  description: string;
  logoUrl: string;
  scores: string;
  owner: string;
  ratePoints: UnorderedMap;

  constructor(uuid: string, title: string, description: string, logoUrl: string) {
    this.title = title;
    this.description = description;
    this.logoUrl = logoUrl;
    this.scores = "0";
    this.owner = near.signerAccountId();
    this.ratePoints = new UnorderedMap(`${uuid}_rate_points`);
  }

  voteUp(accountId: string) {
    const ratePoints = this.ratePoints.get(accountId) as string;
    this.scores = BigInt(this.scores) + BigInt(ratePoints || 0) + "";
    this.ratePoints.set(accountId, "0");
  }

  voteDown(accountId: string) {
    const ratePoints = this.ratePoints.get(accountId) as string;
    this.scores = BigInt(this.scores) - BigInt(ratePoints) + "";
    this.ratePoints.set(accountId, "0");
  }

  allocatePoints(amounts: { [key: string]: string }) {
    for (const [accountId, amount] of Object.entries(amounts)) {
      this.addPoints(accountId, amount);
    }
  }

  private addPoints(accountId: string, amount: string) {
    const newAmount = (BigInt(amount) + BigInt(this.ratePoints.get(accountId) as string || 0)).toString();
    this.ratePoints.set(accountId, newAmount);
  }

}

class VolunteerProposal {
  groupUuid: string;
  requiredAmount: string;
  title: string;
  description: string;
  imageUrls: string[];
  status: 'open' | 'accepted' | 'rejected';
  balance: string;
  amounts: UnorderedMap;

  constructor(uuid: string, groupUuid: string, requiredAmount: string, title: string, description: string, imageUrls: string[]) {
    this.groupUuid = groupUuid;
    this.title = title;
    this.description = description;
    this.imageUrls = imageUrls;
    this.status = "open";
    this.amounts = new UnorderedMap(`${uuid}_amounts`);
    this.requiredAmount = requiredAmount;
  }

  getAllAmounts(): { [key: string]: string } {
    return this.amounts.toArray().reduce((acc, [accountId, amount]) => {
      acc[accountId] = amount;
      return acc;
    }, {});
  }

  getCurrentAmount(): BigInt {
    return this.amounts.values.toArray().map((a: string) => BigInt(a)).reduce((acc, cur) => acc + cur, BigInt(0));
  }

  hasRequiredAmount(): boolean {
    return this.getCurrentAmount() >= BigInt(this.requiredAmount);
  }

  accept() {
    this.status = "accepted";
  }

  fund(accountId: string, amount: string) {
    // Update user amount
    const newAmount = (BigInt(amount) + BigInt(this.amounts.get(accountId) as string || 0)).toString();
    this.amounts.set(accountId, newAmount);

    // Update balance amount
    this.balance = (BigInt(this.balance) + BigInt(amount)).toString();
  }

  // history: ProposalHistory[];
}

//
// type ProposalHistory = {
//   _type: "news",
//   message: string,
//   imageUrls: string[],
//   timestamp: number,
// } & {
//   _type: "proof",
//   message: string,
//   imageUrls: string[],
//   timestamp: number,
// } & {
//   _type: "proof-vote",
//   action: "accept" | "reject",
//   timestamp: number,
// } & {
//   _type: "donate",
//   amount: number,
//   timestamp: number,
// };
