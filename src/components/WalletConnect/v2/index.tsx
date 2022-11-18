import { NetworkConfig } from "@/types/types"
import LedgerLivePlarformSDK, { Account } from "@ledgerhq/live-app-sdk"
import { Dispatch, SetStateAction } from "react"

export type WalletConnectV2Props = {
	initialAccountId?: string
	initialURI?: string
	networks: NetworkConfig[]
	platformSDK: LedgerLivePlarformSDK
	accounts: Account[]
	setUri: Dispatch<SetStateAction<string | undefined>>
}


export function WalletConnectV2(props: WalletConnectV2Props) => {
    return(
        <div>
        </div>
    )
}
