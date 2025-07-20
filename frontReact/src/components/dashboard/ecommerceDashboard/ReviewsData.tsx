import React from 'react';
import { ListGroup, ListGroupItem, Progress } from 'reactstrap';

interface ReviewsDataProps {
  reviewType: React.ReactNode;
  icon: string;
  noofReviews: React.ReactNode;
  rColor?: 'primary' | 'success' | 'danger' | 'default';
  rPercent: number | string;
}

const ReviewsData: React.FC<ReviewsDataProps> = ({ reviewType, icon, noofReviews, rColor = 'default', rPercent }) => {
  return (
    <ListGroup>
      <ListGroupItem className="p-0 my-3 py-2 border-0">
        <div className="d-flex align-items-center">
          <i className={`bi bi-${icon} display-6 text-muted`} />
          <div className="ms-3 w-100">
            <h5 className="mb-0">{reviewType} Reviews</h5>
            <span className="text-muted">{noofReviews} Reviews</span>
            <Progress color={rColor} value={rPercent} className="mt-2" />
          </div>
        </div>
      </ListGroupItem>
    </ListGroup>
  );
};

export default ReviewsData; 