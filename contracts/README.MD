### CLI examples

// ADD GROUP
```
near call dev-1660082350960-99080210452466 addGroup '{"groupUuid":"17", "group": {"title":"a", "description": "desc","logoUrl":"any"}}' --accountId a_p.testnet --gas 300000000000000
```

// GET GROUPS
```
near view dev-1660082350960-99080210452466 getGroups
```

// ADD PROPOSAL
```
near call dev-1660082350960-99080210452466 addProposal '{"uuid":"14", "proposal": {"groupUuid":"17", "requiredAmount":"1008242645161335336","title":"a", "description": "desc","imageUrls":[]}}' --accountId a_p.testnet --gas 300000000000000
```

// VIEW PROPOSALS
```
near view dev-1660082350960-99080210452466 getProposals '{"groupUuid":"17"}'
```

// DONATE TO PROPOSAL
```
near call usdn.testnet ft_transfer_call '{"receiver_id":"dev-1660082350960-99080210452466", "amount":"100824264516133533", "msg":"{\"proposal_uuid\":\"14\"}"}' --accountId apysinfo.testnet --gas 300000000000000 --depositYocto 1
```

