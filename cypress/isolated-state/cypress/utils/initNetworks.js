import { networks } from "./networks"

export const initNetworks = () => {
    networks.forEach(network => {
        cy.addMetamaskNetwork({
            networkName: network.name,
            rpcUrl: network.url,
            chainId: network.chainId,
            symbol: network.symbol,
            blockExplorer: network.explorerUrl,
            isTestnet: true
        })
    })
}
