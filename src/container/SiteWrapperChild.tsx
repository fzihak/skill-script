import { useAuth } from '@faustwp/core'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import {
	updateViewer as updateViewerToStore,
	updateAuthorizedUser,
} from '@/stores/viewer/viewerSlice'
import { updateGeneralSettings } from '@/stores/general-settings/generalSettingsSlice'
import ControlSettingsDemo from './ControlSettingsDemo'
import CookiestBoxPopover from '@/components/CookiestBoxPopover'
import MusicPlayer from '@/components/MusicPlayer/MusicPlayer'
import { initLocalPostsSavedListFromLocalstored } from '@/stores/localPostSavedList/localPostsSavedListSlice'
import { usePathname } from 'next/navigation'
import { CMSUserMetaResponseData } from '@/pages/api/cms-user-meta/[id]'
import { addViewerReactionPosts } from '@/stores/viewer/viewerSlice'

export function SiteWrapperChild({
	...props
}: {
	__TEMPLATE_QUERY_DATA__: any
}) {
	const { isAuthenticated, isReady, loginUrl, viewer } = useAuth()
	const dispatch = useDispatch()
	const pathname = usePathname()

	const [isFirstFetchApis, setIsFirstFetchApis] = useState(false)

	useEffect(() => {
		if (!isAuthenticated || !viewer?.userId || isFirstFetchApis) {
			return
		}
		setIsFirstFetchApis(true)
		dispatch(updateViewerToStore(viewer))
		// get user meta data
		fetch('/api/cms-user-meta/' + viewer?.userId)
			.then((res) => res.json())
			.then((data: CMSUserMetaResponseData) => {
				const user = data?.data?.user
				if (user) {
					dispatch(updateViewerToStore(user))
				}
				if (user?.userReactionFields) {
					const likes = user.userReactionFields.likedPosts || ''
					const saves = user.userReactionFields.savedPosts || ''
					const views = user.userReactionFields.viewedPosts || ''

					const a_likes = likes.split(',') || []
					const a_saves = saves.split(',') || []
					const a_views = views.split(',') || []

					// convert a_likes to array of fake posts
					const likesPosts = a_likes.map((id) => {
						return {
							id: id,
							title: id + ',LIKE',
						}
					})

					// convert a_saves to array of fake posts
					const savesPosts = a_saves.map((id) => {
						return {
							id: id,
							title: id + ',SAVE',
						}
					})

					// convert a_views to array of fake posts
					const viewsPosts = a_views.map((id) => {
						return {
							id: id,
							title: id + ',VIEW',
						}
					})

					const reactionPosts = [...likesPosts, ...savesPosts, ...viewsPosts]
					if (reactionPosts.length > 0) {
						dispatch(addViewerReactionPosts(reactionPosts))
					}
				}
			})
			.catch((error) => {
				console.error(error)
			})
	}, [isAuthenticated, viewer?.userId, isFirstFetchApis])

	// update general settings to store
	useEffect(() => {
		const generalSettings =
			props?.__TEMPLATE_QUERY_DATA__?.generalSettings ?? {}
		dispatch(updateGeneralSettings(generalSettings))
	}, [])

	useEffect(() => {
		const initialStateLocalSavedPosts: number[] = JSON.parse(
			typeof window !== 'undefined'
				? localStorage?.getItem('localSavedPosts') || '[]'
				: '[]',
		)
		dispatch(
			initLocalPostsSavedListFromLocalstored(initialStateLocalSavedPosts),
		)
	}, [])

	// update updateAuthorizedUser to store
	useEffect(() => {
		dispatch(
			updateAuthorizedUser({
				isAuthenticated,
				isReady,
				loginUrl,
			}),
		)
	}, [isAuthenticated])

	if (pathname?.startsWith('/ncmaz_for_ncmazfc_preview_blocks')) {
		return null
	}

	return (
		<div>
			<CookiestBoxPopover />
			<ControlSettingsDemo />
			<MusicPlayer />
		</div>
	)
}
