import {call, near, NearBindgen, NearContract, Vector, view} from 'near-sdk-js'

/*
smart contract features:
- create a volunteer group with the information
- receive usn deposit to some volunteer’s proposal
- send the funds and allocate voting points between the users based on their deposits
- allow increasing or decrease volunteer’s group reputation based on voting points
- allow to withdraw the funds (usn)
- create a proposal: required usn amount, group id
- proposal volunteer’s chat with the news and proofs

 */
@NearBindgen
class MelanieCore extends NearContract {
  groups: Vector;

  constructor() {
    super()
    this.groups = new Vector("groups");
  }

  @call
  addGroup({title, description, logoUrl}: Pick<VolunteerGroup, 'title' | 'description' | 'logoUrl'>) {
    const group = new VolunteerGroup(
      title,
      description,
      logoUrl
    );
    this.groups.push(group);

    near.log(`Group ${title} added`);
  }

  @view
  getGroups() {
    return this.groups.toArray()
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
  proposals: VolunteerProposal[];

  constructor(title: string, description: string, logoUrl: string) {
    this.title = title;
    this.description = description;
    this.logoUrl = logoUrl;
    this.scores = 0;
    this.owner = near.signerAccountId();
    this.proposals = [];
  }
}

class VolunteerProposal {
  title: string;
  description: string;
  imageUrls: string[];
  status: 'open' | 'voting' | 'accepted' | 'rejected';

  constructor(title: string, description: string, imageUrls: string[]) {
    this.title = title;
    this.description = description;
    this.imageUrls = [];
    this.status = "open";
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
