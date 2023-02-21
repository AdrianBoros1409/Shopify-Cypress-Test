import type { GetStaticPropsContext } from 'next'
import commerce from '@lib/api/commerce'
import { Heart } from '@components/icons'
import { Layout } from '@components/common'
import { Text, Container, Skeleton } from '@components/ui'
import { useCustomer } from '@framework/customer'
import { WishlistCard } from '@components/wishlist'
import useWishlist from '@framework/wishlist/use-wishlist'
import rangeMap from '@lib/range-map'

export async function getStaticProps({
  preview,
  locale,
  locales,
}: GetStaticPropsContext) {
  // Disabling page if Feature is not available
  if (!process.env.COMMERCE_WISHLIST_ENABLED) {
    return {
      notFound: true,
    }
  }

  const config = { locale, locales }
  const pagesPromise = commerce.getAllPages({ config, preview })
  const siteInfoPromise = commerce.getSiteInfo({ config, preview })
  const { pages } = await pagesPromise
  const { categories } = await siteInfoPromise

  return {
    props: {
      pages,
      categories,
    },
  }
}

export default function Wishlist() {
  // @ts-ignore Shopify - Fix this types
  const { data, isLoading, isEmpty } = useWishlist({
    includeProducts: true,
  })

  return (
    <Container className="pt-4">
      <div className="mb-20" data-test="wishlist-page-div">
        <Text variant="pageHeading">My Wishlist</Text>
        <div className="group flex flex-col">
          {/* {isLoading ? (
            <div className="grid grid-cols-1 gap-6">
              {rangeMap(4, (i) => (
                <Skeleton key={i}>
                  <div className="w-full h-[279px]" />
                </Skeleton>
              ))}
            </div>
          ) :  */}
          { (
            <div className="flex-1 px-12 py-24 flex flex-col justify-center items-center ">
              <span className="border border-dashed border-secondary flex items-center justify-center w-16 h-16 bg-primary p-12 rounded-lg text-primary">
                <Heart className="absolute" />
              </span>
              <h2 className="pt-6 text-2xl font-bold tracking-wide text-center" data-test="empty-wishlist"> 
                Your wishlist is empty
              </h2>
              <p className="text-accent-6 px-10 text-center pt-2" data-test="wishlist-paragraph">
                Seems like you don't have wishes here. Make a wish.
              </p>
            </div>
          ) 
          // : (
          //   <div className="grid grid-cols-1 gap-6 ">
          //     {data &&
          //       // @ts-ignore - Wishlist Item Type
          //       data.items?.map((item) => (
          //         <WishlistCard key={item.id} item={item} />
          //       ))}
          //   </div>
          // )
        }
        </div>
      </div>
    </Container>
  )
}

Wishlist.Layout = Layout
