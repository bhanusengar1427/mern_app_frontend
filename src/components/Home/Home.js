import React, {useEffect, useState} from 'react';
import { useDispatch } from 'react-redux';
import { getPosts, getPostsBySearch } from '../../actions/posts';
import { Container , Grow, Grid, Paper, AppBar, TextField, Button } from '@material-ui/core'
import Posts from '../Posts/Posts.js';
import Form from '../Form/Form.js';
import useStyles from './styles.js';
import Pagination from '../Pagination';
import { useNavigate, useLocation } from 'react-router-dom';
import ChipInput from 'material-ui-chip-input';

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const Home = () => {
    const [currentId, setCurrentId] = useState(null);
    const classes = useStyles();
    const dispatch = useDispatch();
    const query = useQuery();
    const navigate = useNavigate();
    const page = query.get('page') || 1;
    const searchQuery = query.get('searchQuery');
    const [search, setSearch] = useState('');
    const [tags, setTags] = useState([]);

    const searchPost = () => {
      if(search.trim() || tags){
        dispatch(getPostsBySearch({ search, tags: tags.join(',') }));

        navigate(`/posts/search?searchQuery=${search || 'none'}&tags=${tags.join(',')}`)
      } else {
        navigate('/');
      }
    }

    const handleKeyPress = (e) => {
      if(e.keyCode === 13){
        searchPost();
      }
    };

    const handleAdd = (tag) => setTags([ ...tags, tag ]);

    const handleDelete = (tagToDelete) => setTags(tags.filter((tag) => tag !==tagToDelete));

    return (
      <Grow in>
        <Container maxWidth='xl'>
          <Grid className={classes.gridContainer} container justify="space-between" alignItems="stretch" spacing={3}>
            <Grid item xs={12} sm={6} md={9}>
              <Posts setCurrentId={setCurrentId} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <AppBar className={classes.appBarSearch} position='static' color='inherit'>
                <TextField variant="outlined" name="search" label="Search Memories" fullWidth onKeyPress={handleKeyPress} value={search} onChange={(e) => setSearch(e.target.value)} />
                <ChipInput style={{ margin: '10px 0' }} value={tags} onAdd={handleAdd} onDelete={handleDelete} label="Search Tags" variant="outlined" />
                <Button onClick={searchPost} className={classes.searchButton} color="primary" variant="contained">Search</Button>
              </AppBar>
              <Form currentId={currentId} setCurrentId={setCurrentId} />
              { (!searchQuery && !tags.length) && (
                <Paper elevation={6} className={classes.pagination}>
                  <Pagination page={page} />
                </Paper>
              ) }
            </Grid>
          </Grid> 
        </Container>
      </Grow>
    );
}

export default Home;