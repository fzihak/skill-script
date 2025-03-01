import { gql } from '@/__generated__'
import {
	NcgeneralSettingsFieldsFragmentFragment,
	PageArchiveGetArchiveQuery,
} from '@/__generated__/graphql'
import Alert from '@/components/Alert'
import { TCategoryCardFull } from '@/components/CardCategory1/CardCategory1'
import SocialsShareDropdown from '@/components/SocialsShareDropdown/SocialsShareDropdown'
import PageLayout from '@/container/PageLayout'
import ArchiveLayout from '@/container/archives/ArchiveLayout'
import { GET_POSTS_FIRST_COMMON } from '@/contains/contants'
import { FOOTER_LOCATION, PRIMARY_LOCATION } from '@/contains/menu'
import { PostDataFragmentType } from '@/data/types'
import { getPostFormatDataFromFragment } from '@/utils/getPostFormatDataFromFragment'
import { FaustTemplate } from '@faustwp/core'
import { FireIcon } from '@heroicons/react/24/outline'

const Archive: FaustTemplate<PageArchiveGetArchiveQuery> = (props) => {
	// LOADING ----------
	if (props.loading) {
		return <>Loading...</>
	}

	if (!props?.data || !props.data.nodeByUri) {
		return null
	}

	// START ----------

	if (props.data.nodeByUri.__typename !== 'PostFormat') {
		return (
			<PageLayout
				headerMenuItems={props.data?.primaryMenuItems?.nodes || []}
				footerMenuItems={props.data?.footerMenuItems?.nodes || []}
				pageFeaturedImageUrl={null}
				pageTitle={props.data.nodeByUri.__typename}
				generalSettings={
					props.data?.generalSettings as NcgeneralSettingsFieldsFragmentFragment
				}
			>
				<div className="container py-10">
					<Alert type="error">
						This page is not a PostFormat, please check your page uri again! 🤔
						<br />
						Or please contact the administrator for more details. 🤗
						<br />
						{JSON.stringify(props.data.nodeByUri)}
					</Alert>
				</div>
			</PageLayout>
		)
	}

	const { databaseId, count, description, name, uri } =
		getPostFormatDataFromFragment(props.data.nodeByUri)
	const initPostsPageInfo = props.data?.nodeByUri?.posts?.pageInfo
	const posts = props.data?.nodeByUri?.posts

	const _top10Categories =
		(props.data?.categories?.nodes as TCategoryCardFull[]) || []

	return (
		<>
			<PageLayout
				headerMenuItems={props.data?.primaryMenuItems?.nodes || []}
				footerMenuItems={props.data?.footerMenuItems?.nodes || []}
				pageFeaturedImageUrl={null}
				pageTitle={'Archive ' + name}
				pageDescription={description || ''}
				generalSettings={
					props.data?.generalSettings as NcgeneralSettingsFieldsFragmentFragment
				}
			>
				<ArchiveLayout
					name={name}
					initPosts={posts?.nodes as PostDataFragmentType[] | null}
					initPostsPageInfo={initPostsPageInfo}
					tagDatabaseId={databaseId}
					taxonomyType="tag"
					top10Categories={_top10Categories}
				>
					<div className="container mt-4 md:mt-10">
						<div className="relative flex flex-col gap-4 rounded-3xl border border-neutral-200/70 p-5 md:flex-row md:gap-6 md:rounded-[2rem] lg:p-7 xl:gap-12 dark:border-neutral-700">
							<div className="flex-shrink-0">
								<div className="wil-avatar relative z-0 h-24 w-24 flex-shrink-0 overflow-hidden rounded-3xl ring-4 ring-white sm:h-32 sm:w-32 lg:h-40 lg:w-40 dark:ring-0">
									<div className="absolute inset-0 flex items-center justify-center bg-neutral-100 dark:bg-neutral-800">
										<FireIcon className="h-8 w-8 lg:h-12 lg:w-12" />
									</div>
								</div>
							</div>

							{/*  */}
							<div className="flex-grow">
								<div className="max-w-screen-md space-y-3.5">
									<h1 className="text-xl font-semibold sm:text-2xl md:text-3xl lg:text-4xl">
										<span>{name}</span>
									</h1>
									<div className="flex cursor-pointer items-center space-x-2 text-sm font-medium text-neutral-500 rtl:space-x-reverse dark:text-neutral-400">
										<FireIcon className="h-5 w-5" />
										<span className="text-neutral-700 dark:text-neutral-300">
											{count || 0} Articles
										</span>
									</div>
									<span className="block text-sm text-neutral-500 sm:text-base dark:text-neutral-400">
										{description}
									</span>
								</div>
							</div>

							{/*  */}
							<div className="absolute end-5 top-5">
								<SocialsShareDropdown />
							</div>
						</div>
					</div>
					{/* ====================== END HEADER ====================== */}
				</ArchiveLayout>
			</PageLayout>
		</>
	)
}

Archive.variables = ({ uri }) => ({
	uri,
	first: GET_POSTS_FIRST_COMMON,
	headerLocation: PRIMARY_LOCATION,
	footerLocation: FOOTER_LOCATION,
})

Archive.query = gql(`
 query PageArchiveGetArchive($uri: String! = "", $first: Int, $headerLocation: MenuLocationEnum!, $footerLocation: MenuLocationEnum!) {
  nodeByUri(uri: $uri) {
      uri
      id
      ... on PostFormat {
        ...NcmazFcPostFormatFullFieldsFragment
        posts(first: $first, where: {orderby: {field: DATE, order: DESC}}) {
          nodes {
            ...NcmazFcPostCardFields
          }
          pageInfo {
            endCursor
            hasNextPage
          }
        }
      }
    }
    categories(first:10, where: { orderby: COUNT, order: DESC }) {
      nodes {
        ...NcmazFcCategoryFullFieldsFragment
      }
    }
     # common query for all page 
   generalSettings {
      ...NcgeneralSettingsFieldsFragment
    }
    primaryMenuItems: menuItems(where: { location:  $headerLocation  }, first: 80) {
      nodes {
        ...NcPrimaryMenuFieldsFragment
      }
    }
    footerMenuItems: menuItems(where: { location:  $footerLocation  }, first: 50) {
      nodes {
        ...NcFooterMenuFieldsFragment
      }
    }
    # end common query for all page
  }`)

export default Archive
