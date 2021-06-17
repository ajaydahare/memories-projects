import React, { useEffect } from "react";

import {
  Paper,
  Typography,
  CircularProgress,
  Divider,
  Grid,
} from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { useParams, useHistory } from "react-router-dom";

import useStyles from "./styles";
import { getPost, getPostsBySearch } from "../../actions/posts";
import Post from "../Posts/Post/Post";

function PostDetails() {
  const { post, posts, isLoading } = useSelector((state) => state.posts);
  const dispatch = useDispatch();
  const history = useHistory();
  const classes = useStyles();
  const { id } = useParams();

  useEffect(() => {
    dispatch(getPost(id));
  }, [id]);

  useEffect(() => {
    dispatch(getPostsBySearch({ search: "none", tags: post?.tags.join(",") }));
  }, [post]);

  if (!post) return null;

  if (isLoading) {
    return (
      <Paper elevation={6} className={classes.loadingPaper}>
        <CircularProgress size="7em" />
      </Paper>
    );
  }

  const recommendedPosts = posts.filter(({ _id }) => _id !== post._id);

  return (
    <>
      <Paper style={{ padding: "20px", borderRadius: "15px" }} elevation={6}>
        <div className={classes.card}>
          <div className={classes.section}>
            <Typography variant="h3" component="h2" className={classes.title}>
              {post.title}
            </Typography>
            <Typography
              gutterBottom
              variant="h6"
              color="textSecondary"
              component="h2"
            >
              {post.tags.map((tag) => `#${tag} `)}
            </Typography>
            <Typography gutterBottom variant="body1" component="p">
              {post.message}
            </Typography>
            <Typography variant="h6">Created by: {post.name}</Typography>
            <Typography variant="body1">
              {moment(post.createdAt).fromNow()}
            </Typography>
            <Divider style={{ margin: "20px 0" }} />
          </div>
          <div className={classes.imageSection}>
            <img
              className={classes.media}
              src={
                post.selectedFile ||
                "https://user-images.githubusercontent.com/194400/49531010-48dad180-f8b1-11e8-8d89-1e61320e1d82.png"
              }
              alt={post.title}
            />
          </div>
        </div>
      </Paper>
      {recommendedPosts.length && (
        <div className={classes.section}>
          <Typography gutterBottom variant="h5">
            You Might Also Like
          </Typography>
          <Divider />
          <div className={classes.recommendedPosts}>
            {recommendedPosts.map((post) => (
              <Grid
                className={classes.alsoLike}
                key={post._id}
                item
                xs={12}
                sm={12}
                md={6}
                lg={3}
              >
                <Post post={post} />
              </Grid>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export default PostDetails;
