/* tslint:disable */
/* eslint-disable */
export class FollowResult {
  private constructor();
  free(): void;
  readonly meta: Meta;
  readonly follow: PubkyAppFollow;
}
/**
 * Each FFI function:
 * - Accepts minimal fields in a JavaScript-friendly manner (e.g. strings, JSON).
 * - Creates the Rust model, sanitizes, and validates it.
 * - Generates the ID (if applicable).
 * - Generates the path (if applicable).
 * - Returns { json, id, path, url } or a descriptive error.
 */
export class Meta {
  private constructor();
  free(): void;
  readonly id: string;
  readonly path: string;
  readonly url: string;
}
/**
 * Represents a user's single link with a title and URL.
 */
export class PubkyAppBuilder {
  free(): void;
  /**
   * Creates a new `PubkyAppBuilder` instance.
   */
  constructor(pubky_id: string);
  createFollow(followee_id: string): FollowResult;
  createUser(name: string, bio: string | null | undefined, image: string | null | undefined, links: any, status?: string | null): UserResult;
}
/**
 * Represents raw homeserver follow object with timestamp
 *
 * On follow objects, the main data is encoded in the path
 *
 * URI: /pub/pubky.app/follows/:user_id
 *
 * Example URI:
 *
 * `/pub/pubky.app/follows/pxnu33x7jtpx9ar1ytsi4yxbp6a5o36gwhffs8zoxmbuptici1jy`
 */
export class PubkyAppFollow {
  private constructor();
  free(): void;
  toJson(): any;
  created_at: bigint;
}
/**
 * URI: /pub/pubky.app/profile.json
 */
export class PubkyAppUser {
  free(): void;
  toJson(): any;
  /**
   * Creates a new `PubkyAppUser` instance and sanitizes it.
   */
  constructor(name: string, bio?: string | null, image?: string | null, links?: PubkyAppUserLink[] | null, status?: string | null);
  readonly name: string;
  readonly bio: string | undefined;
  readonly image: string | undefined;
  readonly links: PubkyAppUserLink[] | undefined;
  readonly status: string | undefined;
}
/**
 * Represents a user's single link with a title and URL.
 */
export class PubkyAppUserLink {
  free(): void;
  /**
   * Creates a new `PubkyAppUserLink` instance and sanitizes it.
   */
  constructor(title: string, url: string);
}
export class UserResult {
  private constructor();
  free(): void;
  readonly user: PubkyAppUser;
  readonly meta: Meta;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_pubkyappfollow_free: (a: number, b: number) => void;
  readonly __wbg_get_pubkyappfollow_created_at: (a: number) => bigint;
  readonly __wbg_set_pubkyappfollow_created_at: (a: number, b: bigint) => void;
  readonly pubkyappfollow_toJson: (a: number) => [number, number, number];
  readonly __wbg_pubkyappuser_free: (a: number, b: number) => void;
  readonly pubkyappuser_name: (a: number) => [number, number];
  readonly pubkyappuser_bio: (a: number) => [number, number];
  readonly pubkyappuser_image: (a: number) => [number, number];
  readonly pubkyappuser_links: (a: number) => [number, number];
  readonly pubkyappuser_status: (a: number) => [number, number];
  readonly pubkyappuser_toJson: (a: number) => [number, number, number];
  readonly __wbg_pubkyappuserlink_free: (a: number, b: number) => void;
  readonly pubkyappuser_new: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number, j: number) => number;
  readonly pubkyappuserlink_new: (a: number, b: number, c: number, d: number) => number;
  readonly __wbg_meta_free: (a: number, b: number) => void;
  readonly meta_id: (a: number) => [number, number];
  readonly meta_path: (a: number) => [number, number];
  readonly meta_url: (a: number) => [number, number];
  readonly __wbg_pubkyappbuilder_free: (a: number, b: number) => void;
  readonly __wbg_followresult_free: (a: number, b: number) => void;
  readonly followresult_meta: (a: number) => number;
  readonly followresult_follow: (a: number) => number;
  readonly __wbg_userresult_free: (a: number, b: number) => void;
  readonly userresult_user: (a: number) => number;
  readonly userresult_meta: (a: number) => number;
  readonly pubkyappbuilder_new: (a: number, b: number) => number;
  readonly pubkyappbuilder_createFollow: (a: number, b: number, c: number) => [number, number, number];
  readonly pubkyappbuilder_createUser: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: any, i: number, j: number) => [number, number, number];
  readonly __wbindgen_malloc: (a: number, b: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
  readonly __wbindgen_exn_store: (a: number) => void;
  readonly __externref_table_alloc: () => number;
  readonly __wbindgen_export_4: WebAssembly.Table;
  readonly __externref_table_dealloc: (a: number) => void;
  readonly __wbindgen_free: (a: number, b: number, c: number) => void;
  readonly __externref_drop_slice: (a: number, b: number) => void;
  readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
*
* @returns {InitOutput}
*/
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
