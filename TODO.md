# TODO: Make Dashboard Dynamic and Show Only Author-Published Blogs

## Steps to Complete

- [x] Update backend blogrouter.js to include author's role in the populate for get all blogs route
- [x] Update frontend Dashboard.jsx to fetch blogs from /api/blogs endpoint
- [x] Filter fetched blogs to only show those where author.role === 'author'
- [x] Replace static blogs array with dynamic state (blogs, loading, error)
- [x] Implement useEffect to fetch data on component mount
- [x] Handle loading and error states in the UI
- [x] Ensure pagination works with dynamic data
- [ ] Test the changes by running the app and verifying only author blogs are shown
