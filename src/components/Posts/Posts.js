import React from 'react';
import Post from './Post/Post.js';
import useStyles from './styles';
import { useSelector } from 'react-redux';
import { Grid, CircularProgress } from '@material-ui/core';

const Posts = ({ setCurrentId }) => {
    const { posts, isLoading } = useSelector((state) => state.posts);
    const classes = useStyles();

    //console.warn("posts in Posts",posts);

    if( !posts && !isLoading ) return 'No Posts';

    return(
        !posts?.length ? <CircularProgress /> : (
            <Grid className={classes.container} container alignItems="stretch" spacing={3}>
                 {posts.map((post) => (
                    <Grid key={post._id} item xs={12} sm={6} md={6} lg={6}>
                        <Post post={post} setCurrentId={setCurrentId} />
                    </Grid>
                 ))}
            </Grid>
        )
        
    );
}

export default Posts;