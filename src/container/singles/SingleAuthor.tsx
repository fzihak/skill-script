import { FragmentType } from '@/__generated__'
import { NcmazFcUserFullFieldsFragment } from '@/__generated__/graphql'
import Avatar from '@/components/Avatar/Avatar'
import { NC_USER_FULL_FIELDS_FRAGMENT } from '@/fragments'
import { getImageDataFromImageFragment } from '@/utils/getImageDataFromImageFragment'
import getTrans from '@/utils/getTrans'
import { getUserDataFromUserCardFragment } from '@/utils/getUserDataFromUserCardFragment'
import Link from 'next/link'
import React, { FC } from 'react'

export interface SingleAuthorProps {
	author:
		| FragmentType<typeof NC_USER_FULL_FIELDS_FRAGMENT>
		| NcmazFcUserFullFieldsFragment
}

const SingleAuthor: FC<SingleAuthorProps> = ({ author: authorProp }) => {
	const author = getUserDataFromUserCardFragment(
		authorProp as FragmentType<typeof NC_USER_FULL_FIELDS_FRAGMENT>,
	)

	const T = getTrans()
	return (
		<div className="nc-SingleAuthor flex">
			<Link href={author?.uri || ''}>
				<Avatar
					imgUrl={
						getImageDataFromImageFragment(
							author?.ncUserMeta?.featuredImage?.node,
						).sourceUrl
					}
					userName={author?.name || 'T'}
					sizeClass="h-12 w-12 text-lg sm:text-xl md:h-24 sm:w-24"
					radius="rounded-2xl sm:rounded-3xl"
				/>
			</Link>
			<div className="ms-3 flex max-w-lg flex-col sm:ms-5">
				<span className="text-xs uppercase tracking-wider text-neutral-400">
					{T.pageSingle['WRITTEN BY']}
				</span>
				<h2 className="text-base font-semibold capitalize text-neutral-900 sm:text-lg dark:text-neutral-200">
					<Link href={author?.uri || ''}>{author?.name}</Link>
				</h2>
				<p
					className="mt-1 block text-sm text-neutral-500 dark:text-neutral-300"
					dangerouslySetInnerHTML={{ __html: author?.description || '' }}
				></p>
			</div>
		</div>
	)
}

export default SingleAuthor
