import {assert, call, near, NearBindgen, NearContract, UnorderedMap, Vector, view} from 'near-sdk-js'

/*
smart contract features:
- create a volunteer group with the information √
- receive usn deposit to some volunteer’s proposal √
- send the funds and allocate voting points between the users based on their deposits
- allow increasing or decrease volunteer’s group reputation based on voting points
- allow to withdraw the funds (usn)
- create a proposal: required usn amount, group id
- proposal volunteer’s chat with the news and proofs
 */

@NearBindgen
class MelanieCore extends NearContract {
  groups: UnorderedMap;
  proposals: UnorderedMap;

  constructor() {
    super()
    this.groups = new UnorderedMap("groups");
    this.proposals = new UnorderedMap("proposals");
  }

  @call
  addGroup(groupUuid: string, {
    title,
    description,
    logoUrl
  }: Pick<VolunteerGroup, 'title' | 'description' | 'logoUrl'>) {
    assert(this.groups.get(groupUuid) === undefined, "Group already exists");

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
    return this.groups.toArray()
  }

  @call
  addProposal(uuid: string, {
    groupUuid,
    requiredAmount,
    title,
    description,
    imageUrls
  }: Pick<VolunteerProposal, 'requiredAmount' | 'groupUuid' | 'title' | 'description' | 'imageUrls'>) {
    const group = this.groups.get(groupUuid) as VolunteerGroup;

    // Check if group exists
    assert(!group, `Group with id ${groupUuid} does not exist`);

    // Check that account is owner of group
    assert(group.owner === near.signerAccountId(), "Only owner can add proposal");
    // Check that proposal does not exist
    assert(this.proposals.get(uuid) === undefined, "Proposal already exists");

    this.proposals.set(uuid, new VolunteerProposal(
      uuid,
      groupUuid,
      requiredAmount,
      title,
      description,
      imageUrls
    ));

    near.log(`Group ${title} added`)
  }

  @call
  ft_on_transfer({sender_id, amount, msg}) {
    near.log(`Transfer from ${sender_id} of ${amount} ${near.predecessorAccountId()}, msg: ${msg}`);
    const proposalUuid: string = JSON.parse(msg).proposal_uuid;
    const proposal = this.proposals.get(proposalUuid) as VolunteerProposal;
    assert(!!proposal, "Proposal does not exist");

    assert(proposal.status === "open", "Proposal is not open");

    proposal.fund(sender_id, amount);
    this.proposals.set(proposalUuid, proposal);

    if (proposal.hasRequiredAmount()) {
      proposal.accept();
      this.proposals.set(proposalUuid, proposal);
    }

    return '0';
  }


  default() {
    return new MelanieCore()
  }
}

class VolunteerGroup {
  title: string;
  description: string;
  logoUrl: string;
  scores: number;
  owner: string;
  ratePoints: UnorderedMap;

  constructor(uuid: string, title: string, description: string, logoUrl: string) {
    this.title = title;
    this.description = description;
    this.logoUrl = logoUrl;
    this.scores = 0;
    this.owner = near.signerAccountId();
    this.ratePoints = new UnorderedMap(`${uuid}_rate_points`);
  }
}

class VolunteerProposal {
  groupUuid: string;
  requiredAmount: string;
  title: string;
  description: string;
  imageUrls: string[];
  status: 'open' | 'accepted' | 'rejected';
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
    const newAmount = (BigInt(amount) + BigInt(this.amounts.get(accountId) as string || 0)).toString();
    this.amounts.set(accountId, newAmount);
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
