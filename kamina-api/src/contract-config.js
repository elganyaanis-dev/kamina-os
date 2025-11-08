// Configuration pour votre contrat Kamina ERC20
module.exports = {
  // ABI de base pour ERC20 Ink! (vous devrez générer le vrai ABI plus tard)
  abi: {
    spec: {
      constructors: [
        {
          args: [
            {
              name: "initialSupply",
              type: {
                displayName: ["Balance"],
                type: 1
              }
            }
          ],
          docs: [],
          label: "new",
          payable: false,
          selector: "0x9bae9d5e"
        }
      ],
      messages: [
        {
          args: [
            {
              name: "owner",
              type: {
                displayName: ["AccountId"],
                type: 2
              }
            }
          ],
          docs: ["Returns the account balance for the specified owner."],
          label: "balance_of",
          mutates: false,
          payable: false,
          returnType: {
            displayName: ["Balance"],
            type: 1
          },
          selector: "0x56e929b2"
        },
        {
          args: [
            {
              name: "to",
              type: {
                displayName: ["AccountId"],
                type: 2
              }
            },
            {
              name: "value",
              type: {
                displayName: ["Balance"],
                type: 1
              }
            }
          ],
          docs: ["Transfers value amount of tokens to address to."],
          label: "transfer",
          mutates: true,
          payable: false,
          returnType: {
            displayName: ["Result"],
            type: 3
          },
          selector: "0xfae7bdd2"
        }
      ]
    }
  }
};
