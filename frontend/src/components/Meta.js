import React from 'react';
import {Helmet} from 'react-helmet'


const Meta = ({ title, description, keywords}) => {
  return (
    <Helmet>
        <title>{title}</title>
        <meta name='description' content={description}/>
        <meta name='keyword' content={keywords}/>
    </Helmet>

  )
    
};

Meta.defaultProps = {
    title:  'Welcome to FLYTOSKY',
    description: 'We sell the products in the world',
    keywords: 'drones, electronics, best price, best quality, video makes' 
}

export default Meta;
