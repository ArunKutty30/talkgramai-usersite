import * as React from 'react';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface IAccordionProps extends Omit<AccordionProps, 'children'> {
  title: string;
  description: React.ReactNode;
}

export default function Accordion({ title, description, ...rest }: IAccordionProps) {
  return (
    <div>
      <MuiAccordion sx={{ '&.Mui-expanded': { margin: 0 } }} {...rest}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <Typography sx={{ fontWeight: '500', color: '#000' }}>{title}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>{description}</Typography>
        </AccordionDetails>
      </MuiAccordion>
    </div>
  );
}
