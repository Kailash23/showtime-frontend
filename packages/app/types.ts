export type NFT = {
  nft_id: number;
  contract_address: string;
  token_id: string;
  like_count: number;
  token_name: string;
  token_description: string;
  token_img_url: string;
  token_img_original_url: string;
  token_has_video: number;
  token_animation_url?: any;
  animation_preview_url?: any;
  blurhash: string;
  token_background_color?: any;
  token_aspect_ratio: string;
  token_hidden: number;
  creator_id: number;
  creator_name: string;
  creator_address: string;
  creator_address_nonens: string;
  creator_img_url?: any;
  token_created: Date;
  multiple_owners: number;
  owner_id: number;
  owner_name: string;
  owner_address: string;
  owner_img_url?: string;
  multiple_owners_list?: Array<any>
  token_creator_followers_only: number;
  creator_username?: string;
  creator_verified: number;
  owner_username?: string;
  owner_verified: number;
  comment_count: number;
  owner_count: number;
  token_count: number;
  token_ko_edition?: string;
  token_edition_identifier?: string;
  source_url: string;
  still_preview_url: string;
  mime_type: string;
  chain_identifier: string;
  token_listing_identifier?: string;
  collection_name: string;
  collection_slug: string;
  collection_img_url?: string;
  contract_is_creator: number;
};

export type Creator = {
  profile_id: number;
  name?: string;
  username?: string;
  address: string;
  img_url?: string;
  love_count: number;
  verified: number;
  top_items: NFT[];
};

export interface WalletAddressesV2 {
  address: string;
  ens_domain?: string;
  minting_enabled: boolean;
  email: string;
  is_email: number;
}

export interface WalletAddressesExcludingEmailV2 {
  address: string;
  ens_domain?: string;
  minting_enabled: boolean;
}

export interface Link {
  id: number;
  user_input: string;
  type_id: number;
  type__name: string;
  type__prefix: string;
  type__icon_url: string;
}

export interface Profile {
  profile_id: number;
  name: string;
  verified: boolean;
  img_url: string;
  cover_url: string;
  minting_enabled: boolean;
  wallet_addresses: string[];
  wallet_addresses_v2: WalletAddressesV2[];
  wallet_addresses_excluding_email_v2: WalletAddressesExcludingEmailV2[];
  bio: string;
  website_url: string;
  username: string;
  default_list_id: number;
  default_created_sort_id: number;
  default_owned_sort_id: number;
  notifications_last_opened: Date;
  has_onboarded: boolean;
  links: Link[];
}
