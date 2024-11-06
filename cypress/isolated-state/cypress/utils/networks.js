export const networks = [{
    name: 'Base Sepolia',
    url: 'https://sepolia.base.org',
    chainId: '84532',
    symbol: 'ETH',
    explorerUrl: 'https://base-sepolia.blockscout.com'
}, {
    name: 'Arbitrum Sepolia',
    url: 'https://sepolia-rollup.arbitrum.io/rpc',
    chainId: '421614',
    symbol: 'ETH',
    explorerUrl: 'https://sepolia.arbiscan.io',
},
{
    name: 'OP Sepolia',
    url: 'https://sepolia.optimism.io',
    chainId: '11155420',
    symbol: 'ETH',
    explorerUrl: 'https://optimism-sepolia.blockscout.com',

}]

export const findTokenToSwapTo = (swappingFrom) => {
    return networks.find(network => network.name !== swappingFrom)?.name
}