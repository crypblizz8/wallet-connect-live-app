import styled from 'styled-components'
import { BrowserQRCodeReader, IScannerControls } from '@zxing/browser'
import { useLayoutEffect, useRef } from 'react'
import { Result } from '@zxing/library'
import { Flex, Text } from '@ledgerhq/react-ui'

const QRScannerContainer = styled.div`
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	overflow: hidden;
	position: relative;
`

const QRScannerVideoElement = styled.video`
	object-fit: cover;
    object-position: center center;
	width: 100%;
	height: 100%;
`

type QRScannerProps = {
	onQRScan: (data: string) => void
}

const QRScannerOverlay = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: black;
	opacity: 0.7;
	z-index: 2;
	clip-path: polygon(
		0% 0%,
		0% 100%,
		20% 100%,
		20% 20%,
		80% 20%,
		80% 80%,
		20% 80%,
		20% 100%,
		100% 100%,
		100% 0%
	);
`

export function QRScanner({ onQRScan }: QRScannerProps) {
	const videoRef = useRef(null)

	useLayoutEffect(() => {
		const codeReader = new BrowserQRCodeReader(undefined, { delayBetweenScanAttempts: 500 })
		let controlsRef: IScannerControls | null = null

        if (!videoRef.current) {
            return
        }
        codeReader.decodeFromConstraints(
            {
                video: {
                    facingMode: "environment"
                }
            },
            videoRef.current,
            (result?: Result) => {
                if (result) {
                    onQRScan(result.toString())
                }
            },
        ).then(controls => {
            controlsRef = controls
        })

		return () => {
			if (controlsRef) {
				controlsRef.stop()
			}
		}
	}, [])

	return (
		<QRScannerContainer>
			<QRScannerVideoElement ref={videoRef} />
			<QRScannerOverlay />
		</QRScannerContainer>
	)
}
