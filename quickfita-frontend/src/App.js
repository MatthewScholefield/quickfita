import {
  Box,
  Button,
  Center,
  Heading,
  Image,
  Input,
  InputGroup,
  Link, SimpleGrid, Text, useColorModeValue
} from '@chakra-ui/react';
import { Route, Routes, useSearchParams } from "react-router-dom";
import { SearchIcon } from '@chakra-ui/icons';
import Navbar from './Navbar';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import useCookie from 'react-use-cookie';


const SearchBar = ({ onSubmit }) => {
  const [query, setQuery] = useState('');
  return <InputGroup size='md'>
    <Input p={4}
      onChange={e => { setQuery(e.target.value); }}
      onKeyDown={e => {
        if (e.key === 'Enter') {
          onSubmit(query);
        }
      }}
      pr='4.5rem'
      boxShadow="sm"
      placeholder='Search for movies or TV shows...'
    />
    <Button ml={2} size='md' type='submit' onClick={() => onSubmit(query)} boxShadow="sm" color={"gray.600"}>
      Submit
    </Button>
  </InputGroup>;
};
SearchBar.propTypes = {
  onSubmit: PropTypes.func
};

const EmptyState = () => {
  return (
    <Center m={4} textColor={'gray.600'}>
      <SearchIcon />
      <Text m={2}>
        No results found!
      </Text>
    </Center>
  );
};

const ErrorState = () => {
  return (
    <Center m={4} textColor={'gray.600'}>
      <SearchIcon />
      <Text m={2}>
        Error fetching results!
      </Text>
    </Center>
  );
};
const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8077';

const MainPageContent = ({ urlTemplate }) => {
  const [searchState, setSearchState] = useState('no-query');
  const [results, setResults] = useState([]);
  const resultBgColor = useColorModeValue('gray.30', 'gray.800');
  const resultBgColorHover = useColorModeValue('gray.50', 'gray.700');
  return <>
    <SearchBar onSubmit={query => fetch(
      backendUrl + '/search-all?' + new URLSearchParams({
        query: query
      })
    ).then(r => r.json()).then(r => {
      setResults(r.results);
      setSearchState('queried');
    }).catch(() => {
      setSearchState('error');
    })} />
    {searchState === 'error' ? <ErrorState /> : results.length === 0 && searchState == 'queried' ? <EmptyState /> : <SimpleGrid columns={[1, 1, 2, 3, 3, 4]} spacing={4} mt={4}>
      {results.map(result =>
        <Link
          key={result.id}
          _hover={{
            textDecoration: 'none'
          }}
          href={urlTemplate.replace("{media_type}", result.media_type).replace("{tmdb_id}", result.id).replace("{season}", "1").replace("{episode}", "1")}
          isExternal={true}
        >
          <Center>
            <Box key={results.id} w={['100%', '60%', '100%', '100%', '100%']} bg={resultBgColor} rounded="md"
              boxShadow={"sm"}
              _hover={{ bg: resultBgColorHover }}
              borderWidth="1px" p={4}>

              <Heading fontSize='lg'>{result.title}</Heading >
              <Text mb={4} mt={2}>{result.overview}</Text>
              {result.poster_path ? <Image src={'https://image.tmdb.org/t/p/w500' + result.poster_path} borderRadius={8} /> : <></>}
            </Box>
          </Center>
        </Link>
      )}
    </SimpleGrid>}
  </>;
};
MainPageContent.propTypes = {
  urlTemplate: PropTypes.string
};

export default function App() {
  const [searchParams, _] = useSearchParams();
  const [urlTemplate, setUrlTemplate] = useCookie('urlTemplate', '#');
  for (const [key, value] of searchParams) {
    console.log("VVV", key, value);
  }
  console.log("ZZZJ", urlTemplate);

  const newUrlTemplate = searchParams.get("urlTemplate");
  useEffect(() => {
    if (newUrlTemplate && newUrlTemplate.length > 0) {
      setUrlTemplate(newUrlTemplate);
    }
  }, [newUrlTemplate])
  return <>
    <Navbar />
    <Center>
      <Box p={4} w={['100%', '100%', '90%', '80%', '70%']}>
        <Routes>
          <Route path="/" element={<MainPageContent urlTemplate={urlTemplate} />} />
        </Routes>
      </Box>
    </Center>
  </>;
}
