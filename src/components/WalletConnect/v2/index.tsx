import { InputMode, NetworkConfig } from '@/types/types'
import LedgerLivePlarformSDK, { Account } from '@ledgerhq/live-app-sdk'
import { Text } from '@ledgerhq/react-ui'
import GlitchText from '@ledgerhq/react-ui/components/animations/GlitchText'

import { useCallback, useEffect, useRef, useState } from 'react'

export type WalletConnectProps = {
	initialMode?: InputMode
	initialAccountId?: string
	initialURI?: string
	networks: NetworkConfig[]
	platformSDK: LedgerLivePlarformSDK
	accounts: Account[]
}

export function WalletConnectV2({
	initialMode,
	initialAccountId,
	initialURI,
	networks = [],
	platformSDK,
	accounts,
}: WalletConnectProps) {
	// Set State for the connectClient.
	// Get Pairing / Session Data / ACcount

	useEffect(() => {
		console.log('initialURI', initialURI)
	}, [])

	// const createV2SignClient = () => {
	//     return()
	// }

	// Front End, take through rest of the flow.
	// Waiting for Load
	// Approval: Pairing Session ACCEPT / REJECT

	// Connected State: Disconnect / Switch Accou nt
	// NiceToHave: Been able to sign transactions

	return <div></div>
}
