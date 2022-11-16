export type Block = {
    index: number,
    hash: string,
    previousHash: string,
    nonce: number,
    timestamp: number,
    transactions: BlockTx[]
}

export type TXO = {
    address: string,
    amount: string
}

export type TXI = {
    transaction: string,
    index: number,
    amount: number,
    address: string,
    signature: string
}

export type BlockTx = {
    id: string,
    hash: string,
    type: 'reward' | 'fee' | 'regular',
    data: {
        inputs: TXI[],
        outputs: TXO[]
    }
}