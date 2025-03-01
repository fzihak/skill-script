import React, { FC, useState } from 'react'
import { SingleType1Props } from '../single/single'
import SingleHeader from '../SingleHeader'
import { getPostDataFromPostFragment } from '@/utils/getPostDataFromPostFragment'
import { NcmazFcImageHasDetailFieldsFragment } from '@/__generated__/graphql'
import ListingImageGallery from './ListingImageGallery'
import MyImage from '@/components/MyImage'
import getTrans from '@/utils/getTrans'
import { Album02Icon } from '@/components/Icons/Icons'

const T = getTrans()

interface Props extends SingleType1Props {}

const SingleTypeGallery: FC<Props> = ({ post }) => {
	//

	const [currentImageIndex, setcurrentImageIndex] = useState(-1)

	const { title, ncmazGalleryImgs, postFormats } = getPostDataFromPostFragment(
		post || {},
	)
	let IMAGES_GALLERY =
		ncmazGalleryImgs.filter((item) => !!item?.sourceUrl) || []
	//

	const handleCloseModalImageGallery = () => {
		setcurrentImageIndex(-1)
	}

	const handleOpenModalImageGallery = (index: number) => {
		setcurrentImageIndex(index)
	}

	const renderImageItem = ({
		index,
		item,
	}: {
		item?: NcmazFcImageHasDetailFieldsFragment | null
		index: number
	}) => {
		return (
			<div
				className="absolute inset-0 z-10 cursor-pointer rounded-xl"
				onClick={() => handleOpenModalImageGallery(index)}
			>
				<MyImage
					alt={item?.altText || ''}
					priority
					className="h-full w-full rounded-xl object-cover"
					fill
					src={item?.sourceUrl || ''}
					sizes="(max-width: 320px) 50vw, (max-width: 1280px) 50vw, 750px"
					enableDefaultPlaceholder
				/>
				<div className="absolute inset-0 bg-neutral-900 bg-opacity-20 opacity-0 transition-opacity hover:opacity-100"></div>
			</div>
		)
	}

	return (
		<>
			<div className={`pt-8 lg:pt-16`}>
				{/* SINGLE HEADER */}
				<header className="container rounded-xl">
					<SingleHeader hiddenDesc post={post} />
					<div className="my-10 overflow-hidden">
						{IMAGES_GALLERY[0] && postFormats === 'gallery' && (
							<div className="relative max-h-[60vh] min-h-[240px] sm:min-h-[300px]">
								<div className="relative h-0 w-full pt-[50%]">
									<div className="absolute inset-0 h-full w-full">
										<div className="relative h-full max-h-[60vh] min-h-[240px] w-full overflow-hidden sm:min-h-[300px]">
											{/* list images */}
											<div className="relative grid h-full w-full grid-cols-4 gap-2">
												{/* large image */}
												<div
													className={`relative ${
														IMAGES_GALLERY[1] ? 'col-span-2' : 'col-span-4'
													}`}
												>
													{renderImageItem({
														item: IMAGES_GALLERY[0],
														index: 0,
													})}
												</div>

												{/* list */}
												{IMAGES_GALLERY[1] && (
													<div
														className={`flex gap-2 ${
															IMAGES_GALLERY[3]
																? 'col-span-2 flex-col sm:col-span-1'
																: 'col-span-2 flex-col sm:flex-row'
														}`}
													>
														{[IMAGES_GALLERY[1], IMAGES_GALLERY[2]].map(
															(item, index) =>
																item ? (
																	<div
																		key={
																			index + '__ncmazfaust_' + item?.databaseId
																		}
																		className={`relative flex-1`}
																	>
																		{renderImageItem({
																			item,
																			index: index + 1,
																		})}
																	</div>
																) : null,
														)}
													</div>
												)}

												{IMAGES_GALLERY[3] && (
													<div className="hidden flex-col gap-2 sm:flex">
														{[IMAGES_GALLERY[3], IMAGES_GALLERY[4]].map(
															(item, index) =>
																item ? (
																	<div
																		key={
																			index + '__ncmazfaust_' + item?.databaseId
																		}
																		className={`relative flex-1`}
																	>
																		{renderImageItem({
																			item,
																			index: index + 3,
																		})}
																	</div>
																) : null,
														)}
													</div>
												)}
											</div>

											{/* show more btn */}
											<div
												className="absolute bottom-3 start-3 z-10 flex cursor-pointer items-center justify-center rounded-full bg-neutral-100 p-3 text-neutral-600 hover:bg-neutral-200 sm:px-4 sm:py-2 xl:end-3 xl:start-auto"
												onClick={() => handleOpenModalImageGallery(0)}
											>
												<Album02Icon className="h-5 w-5" />
												<span className="ms-2 hidden text-xs font-medium text-neutral-800 sm:block">
													{T['Show all photos']}
												</span>
											</div>
										</div>
									</div>
								</div>
							</div>
						)}
					</div>
				</header>

				<ListingImageGallery
					isShowModal={currentImageIndex > -1}
					onClose={handleCloseModalImageGallery}
					images={IMAGES_GALLERY as NcmazFcImageHasDetailFieldsFragment[]}
					defaultImageIdx={currentImageIndex}
				/>
			</div>
		</>
	)
}

export default SingleTypeGallery
