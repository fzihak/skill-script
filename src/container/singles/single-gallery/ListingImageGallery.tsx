'use client'

import { FC, Fragment, useEffect, useState } from 'react'
import {
	Dialog,
	DialogPanel,
	Transition,
	TransitionChild,
} from '@headlessui/react'
import { NcmazFcImageHasDetailFieldsFragment } from '@/__generated__/graphql'
import NextBtn from '@/components/NextPrev/NextBtn'
import PrevBtn from '@/components/NextPrev/PrevBtn'
import SocialsShareDropdown from '@/components/SocialsShareDropdown/SocialsShareDropdown'
import MyImage from '@/components/MyImage'
import { useWindowSize } from '@/hooks/useWindowSize'
import { ArrowLeftIcon } from '@heroicons/react/24/solid'

interface Props {
	images?: NcmazFcImageHasDetailFieldsFragment[]
	onClose?: () => void
	isShowModal: boolean
	defaultImageIdx: number
}

const ListingImageGallery: FC<Props> = ({
	images,
	onClose,
	isShowModal,
	defaultImageIdx = 0,
}) => {
	const [currentImageIndex, setcurrentImageIndex] = useState(defaultImageIdx)
	const currentImage = images?.[currentImageIndex]

	useEffect(() => {
		setcurrentImageIndex(defaultImageIdx)
	}, [defaultImageIdx])

	const handleClose = () => {
		onClose && onClose()
	}

	const { width } = useWindowSize()
	const isMobile = width < 640

	return (
		<>
			<Transition appear show={isShowModal} as={Fragment}>
				<Dialog
					as="div"
					className="dark fixed inset-0 z-40 bg-neutral-900 text-white"
					onClose={handleClose}
				>
					<TransitionChild
						as={Fragment}
						enter="ease-out duration-300"
						enterFrom="opacity-0"
						enterTo="opacity-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
					>
						<div className="fixed inset-0 bg-neutral-900" />
					</TransitionChild>

					<div className="flex h-full w-full items-center justify-center text-center">
						<TransitionChild
							as={Fragment}
							enter="ease-out duration-300"
							enterFrom="opacity-0 translate-y-5"
							enterTo="opacity-100 translate-y-0"
							leave="ease-in duration-200"
							leaveFrom="opacity-100 translate-y-0"
							leaveTo="opacity-0 translate-y-5"
						>
							<DialogPanel className="relative flex h-full w-full transform flex-col transition-all sm:px-4 md:px-6 lg:px-8 xl:px-10">
								{/* head */}
								<div className="flex flex-shrink-0 items-center justify-between px-4 pb-6 pt-4 sm:px-0 sm:pt-6 lg:pt-10">
									<button
										className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-neutral-800 focus:outline-none focus:ring-0"
										onClick={handleClose}
									>
										<ArrowLeftIcon className="h-6 w-6" />
									</button>

									{!isMobile && (
										<div className="">
											{currentImageIndex + 1} / {images?.length || 0}
										</div>
									)}

									<SocialsShareDropdown />
								</div>

								{/* next pre btn */}
								{!isMobile && (
									<div>
										<div className="absolute start-0 top-1/2 z-10 -translate-y-1/2 sm:start-4 xl:start-10">
											{currentImageIndex > 0 && (
												<PrevBtn
													onClick={() => {
														setcurrentImageIndex(currentImageIndex - 1)
													}}
													className="h-12 w-12 text-lg"
												/>
											)}
										</div>
										<div className="absolute end-0 top-1/2 z-10 -translate-y-1/2 sm:end-4 xl:end-10">
											{currentImageIndex < (images?.length || 1) - 1 && (
												<NextBtn
													onClick={() => {
														setcurrentImageIndex(currentImageIndex + 1)
													}}
													className="h-12 w-12 text-lg"
												/>
											)}
										</div>
									</div>
								)}

								{/* content */}
								<div className="relative flex-1 select-none">
									<div className="hiddenScrollbar absolute inset-0 flex select-none snap-x snap-mandatory gap-x-2.5 overflow-x-auto text-center">
										{images?.map((image, index) => {
											return (
												<Transition
													key={index + '_ncmazfaust__' + image.databaseId}
													as={'div'}
													show={isMobile ? true : index === currentImageIndex}
													enter="ease-out duration-300"
													enterFrom="opacity-0"
													enterTo="opacity-100"
													leave="ease-in duration-200"
													leaveFrom="opacity-100"
													leaveTo="opacity-0"
													className="flex h-full w-full shrink-0 snap-start flex-col align-bottom"
												>
													<>
														<div className="relative flex-1 align-bottom">
															<div className="absolute inset-0">
																<MyImage
																	alt={image?.altText || ''}
																	className="h-full w-full transform rounded-lg object-contain align-bottom"
																	fill={!isMobile}
																	width={
																		isMobile
																			? image?.mediaDetails?.width || 0
																			: undefined
																	}
																	height={
																		isMobile
																			? image?.mediaDetails?.height || 0
																			: undefined
																	}
																	src={image?.sourceUrl || ''}
																	sizes="(max-width: 640px) 100vw,  90vw"
																/>
															</div>
														</div>

														{isMobile && (
															<div
																className="flex gap-4 p-4 text-start text-sm text-neutral-300 sm:px-0 sm:py-6"
																dangerouslySetInnerHTML={{
																	__html: `<div class="flex-shrink-0">${
																		index + 1
																	} / ${images.length}</div> ${
																		image?.caption || ''
																	}`,
																}}
															></div>
														)}
													</>
												</Transition>
											)
										})}
									</div>
								</div>

								{/* caption */}
								{!isMobile && (
									<div
										className="mx-auto max-w-xl py-4 text-center text-sm text-neutral-300 transition-opacity duration-200 sm:py-6"
										dangerouslySetInnerHTML={{
											__html: currentImage?.caption || '',
										}}
									></div>
								)}
							</DialogPanel>
						</TransitionChild>
					</div>
				</Dialog>
			</Transition>
		</>
	)
}

export default ListingImageGallery
