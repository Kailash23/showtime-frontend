import { useState, useEffect, useContext } from "react";
import Head from "next/head";
import _ from "lodash";
import Layout from "../../components/layout";
//import TokenGridV3 from "../../components/TokenGridV3";
import TokenGridV4 from "../../components/TokenGridV4";
import { useRouter } from "next/router";
import Select from "react-dropdown-select";
import backend from "../../lib/backend";
//import ShareButton from "../../components/ShareButton";
import AppContext from "../../context/app-context";
import mixpanel from "mixpanel-browser";

export async function getServerSideProps(context) {
  const { collection } = context.query;

  // Get list of collections
  const response_collection_list = await backend.get(`/v1/collection_list`);
  const collection_list = [
    {
      name: "Filter by collection",
      value: "all",
      order_by: "visitor_count",
      order_direction: "desc",
      img_url: "/logo_sm.jpg",
    },
    ...response_collection_list.data.data,
  ];

  const selected_collection =
    collection_list.filter((item) => item.value === collection).length > 0
      ? collection_list.filter((item) => item.value === collection)[0]
      : null;

  return {
    props: {
      collection_list,
      collection,
      selected_collection,
    }, // will be passed to the page component as props
  };
}

export default function Collection({
  //collection_items,
  collection_list,
  collection,
  selected_collection,
}) {
  const [sortBy, setSortby] = useState("random");

  const [pageTitle, setPageTitle] = useState(
    selected_collection
      ? selected_collection.name === "Filter by collection"
        ? "Explore"
        : `Explore ${selected_collection.name}`
      : `Explore ${collection}`
  );

  const context = useContext(AppContext);

  const router = useRouter();

  const [isChanging, setIsChanging] = useState(true);

  useEffect(() => {
    setCurrentCollectionSlug(router.query.collection);
    if (router.query.collection == "all") {
      setPageTitle("Explore");
      setCurrentCollectionSlug("all");
    }
  }, [router.query.collection]);

  const onChange = async (values) => {
    mixpanel.track("Collection filter dropdown select", {
      collection: values[0]["value"],
    });
    router.push("/c/[collection]", `/c/${values[0]["value"]}`, {
      shallow: true,
    });
    setPageTitle(
      values[0]["name"] === "Filter by collection"
        ? "Explore"
        : `Explore ${values[0]["name"]}`
    );
    setCurrentCollectionSlug(values[0]["value"]);
  };

  const [collectionItems, setCollectionItems] = useState([]);
  const [currentCollectionSlug, setCurrentCollectionSlug] = useState(
    collection
  );
  const [randomNumber, setRandomNumber] = useState(1);

  useEffect(() => {
    let isSubscribed = true;

    const getCollectionItems = async (collection_name) => {
      setIsChanging(true);
      const response_collection_items = await backend.get(
        `/v2/collection?limit=200&order_by=${sortBy}&collection=${collection_name}`
      );

      mixpanel.track("Explore page view", {
        collection: collection_name,
        sortby: sortBy,
      });

      if (sortBy == "random" && collection_name == "all") {
        // Resetting the cache for random items - for next load
        backend.get(
          `/v2/collection?limit=200&recache=1&order_by=${sortBy}&collection=${collection_name}`
        );
      }

      if (isSubscribed) {
        setCollectionItems(response_collection_items.data.data);
      }
      setIsChanging(false);
    };

    getCollectionItems(currentCollectionSlug);

    return () => (isSubscribed = false);
  }, [currentCollectionSlug, sortBy, randomNumber]);

  const [gridWidth, setGridWidth] = useState();
  const [menuPadding, setMenuPadding] = useState(0);
  useEffect(() => {
    if (context.windowSize && context.windowSize.width < 820) {
      setGridWidth(context.windowSize.width);
      setMenuPadding(0);
    } else if (context.windowSize && context.windowSize.width < 1200) {
      setGridWidth(790 - 18);
      setMenuPadding(0);
    } else if (context.windowSize && context.windowSize.width < 1600) {
      setGridWidth(1185 - 18);
      setMenuPadding(0);
    } else {
      setGridWidth(1580 - 18);
      setMenuPadding(0);
    }
  }, [context.windowSize]);

  return (
    <Layout key={collection}>
      <Head>
        <title>{pageTitle}</title>

        <meta name="description" content="Discover and showcase digital art" />
        <meta property="og:type" content="website" />
        <meta
          name="og:description"
          content="Discover and showcase digital art"
        />

        <meta
          property="og:image"
          content={
            selected_collection
              ? selected_collection.img_url
              : "https://showtime.kilkka.vercel.app/banner.png"
          }
        />

        <meta name="og:title" content={`Showtime | ${pageTitle}`} />

        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={`Showtime | ${pageTitle}`} />
        <meta
          name="twitter:description"
          content="Discover and showcase digital art"
        />

        <meta
          name="twitter:image"
          content={
            selected_collection
              ? selected_collection.img_url
              : "https://showtime.kilkka.vercel.app/banner.png"
          }
        />
      </Head>

      <div className="flex flex-col text-center w-full">
        <div className="showtime-title text-center mx-auto text-3xl md:text-5xl mt-5 py-10">
          {pageTitle}
        </div>
      </div>

      {gridWidth > 0 ? (
        <div
          className="mx-auto mb-6 text-xs sm:text-sm flex flex-col md:flex-row items-center"
          style={{
            width: gridWidth,
            paddingLeft: menuPadding,
            paddingRight: menuPadding,
          }}
        >
          {collection_list && collection_list.length > 0 ? (
            <div
              className="flex flex-row items-center mb-6 md:mb-0"
              style={{ width: 250 }}
            >
              <div className="text-left" style={{ width: 250 }}>
                <Select
                  options={collection_list}
                  labelField="name"
                  valueField="value"
                  values={collection_list.filter(
                    (item) => item.value === currentCollectionSlug
                  )}
                  searchable={false}
                  onChange={(values) => onChange(values)}
                  style={{ fontSize: 16 }}
                />
              </div>
              {/*<div className="">
                <ShareButton
                  url={
                    typeof window !== "undefined" ? window.location.href : null
                  }
                  type={"collection"}
                />
                </div>*/}
            </div>
          ) : null}

          <div className="text-right flex-grow">
            {context.windowSize ? (
              context.windowSize.width < 375 ? (
                <>
                  <br />
                  <br />
                </>
              ) : null
            ) : null}
            <button
              className={
                sortBy === "random"
                  ? "showtime-like-button-pink px-2 sm:px-3 py-1"
                  : "showtime-like-button-white px-2 sm:px-3 py-1"
              }
              style={{
                borderBottomRightRadius: 0,
                borderTopRightRadius: 0,
                borderRightWidth: 1,
              }}
              onClick={() => {
                if (sortBy === "random") {
                  // Rerun the random tab
                  setRandomNumber(Math.random());
                  mixpanel.track("Random button re-clicked");
                } else {
                  setSortby("random");
                  mixpanel.track("Random button clicked");
                }
              }}
            >
              Random
            </button>
            <button
              className={
                sortBy === "sold"
                  ? "showtime-like-button-pink px-2 py-1"
                  : "showtime-like-button-white px-2 py-1"
              }
              style={{
                borderRadius: 0,
                borderLeftWidth: 1,
                borderRightWidth: 1,
              }}
              onClick={() => {
                setSortby("sold");
                mixpanel.track("Recently sold button clicked");
              }}
            >
              {context.windowSize && context.windowSize.width < 370
                ? "Sold"
                : "Recently Sold"}
            </button>
            <button
              className={
                sortBy === "newest"
                  ? "showtime-like-button-pink px-2 py-1"
                  : "showtime-like-button-white px-2 py-1"
              }
              style={{
                borderRadius: 0,
                borderLeftWidth: 1,
                borderRightWidth: 1,
              }}
              onClick={() => {
                setSortby("newest");
                mixpanel.track("Newest button clicked");
              }}
            >
              Newest
            </button>
            <button
              className={
                sortBy === "oldest"
                  ? "showtime-like-button-pink px-2 py-1"
                  : "showtime-like-button-white px-2 py-1"
              }
              style={{
                borderRadius: 0,
                borderLeftWidth: 1,
                borderRightWidth: 1,
              }}
              onClick={() => {
                setSortby("oldest");
                mixpanel.track("Oldest button clicked");
              }}
            >
              Oldest
            </button>
            <button
              className={
                sortBy === "trending"
                  ? "showtime-like-button-pink px-2 py-1"
                  : "showtime-like-button-white px-2 py-1"
              }
              style={{
                borderTopLeftRadius: 0,
                borderBottomLeftRadius: 0,
                borderLeftWidth: 1,
              }}
              onClick={() => {
                setSortby("trending");
                mixpanel.track("Trending button clicked");
              }}
            >
              Trending
            </button>
          </div>
        </div>
      ) : null}

      <div className="mb-6 mt-4 text-center">
        {isChanging ? (
          "Loading..."
        ) : (
          <div class="text-left">
            <TokenGridV4 items={collectionItems} />
          </div>
        )}
      </div>
    </Layout>
  );
}
