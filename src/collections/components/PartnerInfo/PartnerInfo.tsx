import React from 'react';
import { Typography } from '@material-ui/core';
import ReactMarkdown from 'react-markdown';
import { CollectionPartner } from '../../api/collection-api/generatedTypes';

interface PartnerInfoProps {
  /**
   * An object with everything partner-related in it.
   */
  partner: CollectionPartner;
}

/**
 * A simple component that shows partner information. The name of the partner
 * and their accompanying image are rendered by other components
 * on the Partner page.
 *
 * @param props
 * @constructor
 */
export const PartnerInfo: React.FC<PartnerInfoProps> = (props): JSX.Element => {
  const { partner } = props;

  return (
    <>
      <Typography>
        <a href={partner.url}>{partner.url}</a>
      </Typography>
      <ReactMarkdown>{partner.blurb}</ReactMarkdown>
    </>
  );
};
