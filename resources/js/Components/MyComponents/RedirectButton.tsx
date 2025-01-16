import React from 'react';
import axios from 'axios';
import { Button } from '@/Components/ui/button';

interface RedirectButtonProps {
  itemId: number;
  productUrl: string;
  className?: string;
}

const RedirectButton: React.FC<RedirectButtonProps> = ({ itemId, productUrl, className }) => {
  const handleRedirect = async () => {
    try {
      // Call the backend to log the redirect and get the final redirect URL
      const response = await axios.get(`/redirect/${itemId}`);

      // Check if the backend responded with a unique_hash
      if (response.data && response.data.unique_hash) {
        // Construct the redirect URL
        const redirectUrl = `${productUrl}?dovana=${response.data.unique_hash}`;
        
        // Redirect the user to the product URL with the unique_hash
        window.location.href = redirectUrl;
      } else {
        console.error('Unique hash not found in the response.');
      }
    } catch (error) {
      console.error('Error logging redirect:', error);
    }
  };

  return (
    <Button
      className={className}
      onClick={handleRedirect}
    >
      Apsilankyti
    </Button>
  );
};

export default RedirectButton;
