# Pubky.app Data Model Specification

_Version 0.2.1_

> ⚠️ **Warning: Rapid Development Phase**  
> This specification is in an **early development phase** and is evolving quickly. Expect frequent changes and updates as the system matures. Consider this a **v0 draft**.
>
> When we reach the first stable, long-term support version of the schemas, paths will adopt the format: `pubky.app/v1/` to indicate compatibility and stability.

## Table of Contents

1. [Introduction](#introduction)
2. [Quick Start](#quick-start)
3. [Data Models](#data-models)
   - [PubkyAppUser](#pubkyappuser)
   - [PubkyAppFile](#pubkyappfile)
   - [PubkyAppPost](#pubkyapppost)
   - [PubkyAppTag](#pubkyapptag)
   - [PubkyAppBookmark](#pubkyappbookmark)
   - [PubkyAppFollow](#pubkyappfollow)
   - [PubkyAppMute](#pubkyappmute)
   - [PubkyAppFeed](#pubkyappfeed)
   - [PubkyAppLastRead](#pubkyapplastread)
4. [Validation Rules](#validation-rules)
   - [Common Rules](#common-rules)
   - [ID Generation](#id-generation)
5. [Glossary](#glossary)
6. [Examples](#examples)
   - [PubkyAppUser](#example-pubkyappuser)
   - [PubkyAppPost](#example-pubkyapppost)
   - [PubkyAppTag](#example-pubkyapptag)
7. [License](#license)

---

## Introduction

This document specifies the data models and validation rules for the **Pubky.app** clients interactions. It defines the structure of data entities, their properties, and the validation rules to ensure data integrity and consistency. This is intended for developers building compatible libraries or clients.

This document intents to be a faithful representation of our [Rust pubky.app models](https://github.com/pubky/pubky-app-specs/tree/main/src). If you intend to develop in Rust, use them directly. In case of disagreement between this document and the Rust implementation, the Rust implementation prevails.

---

## Quick Start

Pubky.app models are designed for decentralized content sharing. The system uses a combination of timestamp-based IDs and Blake3-hashed IDs encoded in Crockford Base32 to ensure unique identifiers for each entity.

### Concepts:

- **Timestamp IDs** for sequential objects like posts and files.
- **Hash IDs** for content-based uniqueness (e.g., tags and bookmarks).
- **Validation Rules** ensure consistent and interoperable data formats.

---

## Data Models

### PubkyAppUser

**Description:** Represents a user's profile information.

**URI:** `/pub/pubky.app/profile.json`

| **Field** | **Type** | **Description**                         | **Validation Rules**                                                                         |
| --------- | -------- | --------------------------------------- | -------------------------------------------------------------------------------------------- |
| `name`    | String   | User's name.                            | Required. Length: 3–50 characters. Cannot be `"[DELETED]"`.                                  |
| `bio`     | String   | Short biography.                        | Optional. Maximum length: 160 characters.                                                    |
| `image`   | String   | URL to the user's profile image.        | Optional. Valid URL. Maximum length: 300 characters.                                         |
| `links`   | Array    | List of associated links (title + URL). | Optional. Maximum of 5 links, each with title (100 chars max) and valid URL (300 chars max). |
| `status`  | String   | User's current status.                  | Optional. Maximum length: 50 characters.                                                     |

**Validation Notes:**

- Reserved keyword `[DELETED]` cannot be used for `name`.
- Each `UserLink` in `links` must have a valid title and URL.

**Example: Valid User**

```json
{
  "name": "Alice",
  "bio": "Toxic maximalist.",
  "image": "pubky://user_id/pub/pubky.app/files/0000000000000",
  "links": [
    {
      "title": "GitHub",
      "url": "https://github.com/alice"
    }
  ],
  "status": "Exploring decentralized tech."
}
```

---

### PubkyAppFile

**Description:** Represents a file uploaded by the user, containing its metadata, including a reference to the actual blob of the file in `src` property.

**URI:** `/pub/pubky.app/files/:file_id`

| **Field**      | **Type** | **Description**             | **Validation Rules**                           |
| -------------- | -------- | --------------------------- | ---------------------------------------------- |
| `name`         | String   | Name of the file.           | Required. Must be 1-255 characters             |
| `created_at`   | Integer  | Unix timestamp of creation. | Required.                                      |
| `src`          | String   | File blob URL               | Required. must be a valid URL. Max length 1024 |
| `content_type` | String   | MIME type of the file.      | Required. Valid IANA mime types                |
| `size`         | Integer  | Size of the file in bytes.  | Required. Positive integer. Max size is 10Mb   |

**Validation Notes:**

- The `file_id` in the URI must be a valid **Timestamp ID**.

---

### PubkyAppPost

**Description:** Represents a user's post.

**URI:** `/pub/pubky.app/posts/:post_id`

| **Field**     | **Type** | **Description**                      | **Validation Rules**                                                       |
| ------------- | -------- | ------------------------------------ | -------------------------------------------------------------------------- |
| `content`     | String   | Content of the post.                 | Required. Max length: 1000 (short), 50000 (long). Cannot be `"[DELETED]"`. |
| `kind`        | String   | Type of post.                        | Required. Must be a valid `PubkyAppPostKind` value.                        |
| `parent`      | String   | URI of the parent post (if a reply). | Optional. Must be a valid URI if present.                                  |
| `embed`       | Object   | Embedded content (type + URI).       | Optional. URI must be valid if present.                                    |
| `attachments` | Array    | List of attachment URIs.             | Optional. Each must be a valid URI.                                        |

**Post Kinds:**

- `short`
- `long`
- `image`
- `video`
- `link`
- `file`

**Example: Valid Post**

```json
{
  "content": "Hello world! This is my first post.",
  "kind": "short",
  "parent": null,
  "embed": {
    "kind": "short",
    "uri": "pubky://user_id/pub/pubky.app/posts/0000000000000"
  },
  "attachments": ["pubky://user_id/pub/pubky.app/files/0000000000000"]
}
```

---

### PubkyAppTag

**Description:** Represents a tag applied to a URI.

**URI:** `/pub/pubky.app/tags/:tag_id`

| **Field**    | **Type** | **Description**             | **Validation Rules**                                     |
| ------------ | -------- | --------------------------- | -------------------------------------------------------- |
| `uri`        | String   | URI of the tagged object.   | Required. Must be a valid URI.                           |
| `label`      | String   | Label for the tag.          | Required. Trimmed, lowercase. Max length: 20 characters. |
| `created_at` | Integer  | Unix timestamp of creation. | Required.                                                |

**Validation Notes:**

- The `tag_id` is a **Hash ID** derived from the `uri` and `label`.

---

### PubkyAppBookmark

**Description:** Represents a bookmark to a URI.

**URI:** `/pub/pubky.app/bookmarks/:bookmark_id`

| **Field**    | **Type** | **Description**        | **Validation Rules**           |
| ------------ | -------- | ---------------------- | ------------------------------ |
| `uri`        | String   | URI of the bookmark.   | Required. Must be a valid URI. |
| `created_at` | Integer  | Timestamp of creation. | Required.                      |

**Validation Notes:**

- The `bookmark_id` is a **Hash ID** derived from the `uri`.

---

### PubkyAppFollow

**Description:** Represents a follow relationship.

**URI:** `/pub/pubky.app/follows/:user_id`

| **Field**    | **Type** | **Description**        | **Validation Rules** |
| ------------ | -------- | ---------------------- | -------------------- |
| `created_at` | Integer  | Timestamp of creation. | Required.            |

---

### PubkyAppFeed

**Description:** Represents a feed configuration.

**URI:** `/pub/pubky.app/feeds/:feed_id`

| **Field** | **Type** | **Description**                           | **Validation Rules**               |
| --------- | -------- | ----------------------------------------- | ---------------------------------- |
| `tags`    | Array    | List of tags for filtering.               | Optional. Strings must be trimmed. |
| `reach`   | String   | Feed visibility (e.g., `all`, `friends`). | Required. Must be a valid reach.   |
| `layout`  | String   | Feed layout style (e.g., `columns`).      | Required. Must be valid layout.    |
| `sort`    | String   | Sort order (e.g., `recent`).              | Required. Must be valid sort.      |
| `content` | String   | Type of content filtered.                 | Optional.                          |
| `name`    | String   | Name of the feed.                         | Required.                          |

---

## Validation Rules

### Common Rules

1. **Timestamp IDs:** 13-character Crockford Base32 strings derived from timestamps (in microseconds).
2. **Hash IDs:** First half of the bytes from the resulting Blake3-hashed strings encoded in Crockford Base32.
3. **URLs:** All URLs must pass standard validation.

---

## License

This specification is released under the MIT License.
