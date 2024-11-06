import { networks } from './networks';

const WALLET_ADDRESS = '0x4985fe67E13C92207A3749854a80Dc965fb2fD73'

function formatUnits(balanceInWei, decimals = 18) {
    const factor = 10 ** decimals;
    return parseFloat((BigInt(balanceInWei) / BigInt(factor)).toString()) +
        parseFloat((BigInt(balanceInWei) % BigInt(factor)).toString()) / factor;
}

async function getBalanceFromRpc(rpcUrl, walletAddress) {
    const response = await fetch(rpcUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            jsonrpc: '2.0',
            method: 'eth_getBalance',
            params: [walletAddress, 'latest'],
            id: 1
        })
    });

    const data = await response.json();
    if (data.result) {
        const balanceInWei = BigInt(data.result);
        return parseFloat(formatUnits(balanceInWei, 18))
    } else {
        console.error('Error fetching balance:', data.error);
    }
    return 0
}

export const getBalance = async (wallet) => {
    // @ts-ignore
    const response = await window.ethereum.request({
        "method": "eth_getBalance",
        "params": [
            wallet,
            "latest"
        ],
    });

    return ethers.formatUnits(response, 18)
}

export const getBalances = async () => {
    const balances = await Promise.all(networks.map(async (network) => {
        const balance = await getBalanceFromRpc(network.url, WALLET_ADDRESS)
        return {
            name: network.name,
            balance
        }
    }))
    console.log(balances)

    return balances
    // const highestBalance = balances.reduce((max, balance) => balance.balance > max.balance ? balance : max, { name: '', balance: 0 });
    // return highestBalance
}