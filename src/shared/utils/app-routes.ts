export const AppRoutes = {
  home: () => "/",
  log: {
    list: () => "/log",
    post: (slug: string) => `/log/${slug}`,
  },
  posts: {
    list: () => "/posts",
    post: (slug: string) => `/posts/${slug}`,
  },
  series: {
    list: () => "/series",
    detail: (seriesSlug: string) => `/series/${seriesSlug}`,
    post: (seriesSlug: string, postSlug: string) =>
      `/series/${seriesSlug}/${postSlug}`,
  },
  admin: {
    posts: {
      list: () => "/admin/posts",
      new: () => "/admin/posts/new",
      edit: (id: string) => `/admin/posts/${id}/edit`,
    },
    series: {
      list: () => "/admin/series",
    },
  },
}
