/* tslint:disable */
/* eslint-disable */
export function create_pubky_app_user(name: string, bio: string | null | undefined, image: string | null | undefined, links: any, status?: string | null): any;
export function create_pubky_app_feed(tags: any, reach: string, layout: string, sort: string, content: string | null | undefined, name: string): any;
export function create_pubky_app_file(name: string, src: string, content_type: string, size: bigint): any;
export function create_pubky_app_post(content: string, kind: string, parent: string | null | undefined, embed: any, attachments: any): any;
export function create_pubky_app_tag(uri: string, label: string): any;
export function create_pubky_app_bookmark(uri: string): any;
export function create_pubky_app_follow(pubky_id: string): any;
export function create_pubky_app_mute(pubky_id: string): any;
export function create_pubky_app_last_read(): any;
/**
 * URI: /pub/pubky.app/profile.json
 */
export class PubkyAppUser {
  free(): void;
  /**
   * Creates a new `PubkyAppUser` instance and sanitizes it.
   */
  constructor(name: string, bio?: string | null, image?: string | null, links?: PubkyAppUserLink[] | null, status?: string | null);
  get_data(): any;
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

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_pubkyappuser_free: (a: number, b: number) => void;
  readonly __wbg_pubkyappuserlink_free: (a: number, b: number) => void;
  readonly pubkyappuser_new: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number, j: number) => number;
  readonly pubkyappuser_get_data: (a: number) => [number, number, number];
  readonly pubkyappuserlink_new: (a: number, b: number, c: number, d: number) => number;
  readonly create_pubky_app_user: (a: number, b: number, c: number, d: number, e: number, f: number, g: any, h: number, i: number) => [number, number, number];
  readonly create_pubky_app_feed: (a: any, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number, j: number, k: number) => [number, number, number];
  readonly create_pubky_app_file: (a: number, b: number, c: number, d: number, e: number, f: number, g: bigint) => [number, number, number];
  readonly create_pubky_app_post: (a: number, b: number, c: number, d: number, e: number, f: number, g: any, h: any) => [number, number, number];
  readonly create_pubky_app_tag: (a: number, b: number, c: number, d: number) => [number, number, number];
  readonly create_pubky_app_bookmark: (a: number, b: number) => [number, number, number];
  readonly create_pubky_app_follow: (a: number, b: number) => [number, number, number];
  readonly create_pubky_app_mute: (a: number, b: number) => [number, number, number];
  readonly create_pubky_app_last_read: () => [number, number, number];
  readonly __wbindgen_malloc: (a: number, b: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
  readonly __wbindgen_exn_store: (a: number) => void;
  readonly __externref_table_alloc: () => number;
  readonly __wbindgen_export_4: WebAssembly.Table;
  readonly __externref_table_dealloc: (a: number) => void;
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
