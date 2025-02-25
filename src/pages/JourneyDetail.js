import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

const DetailContainer = styled.div`
  padding: 2rem;
  max-width: 1000px;
  margin: 0 auto;
`;

const Card = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  padding: 2rem;
`;

const Title = styled.h1`
  color: #1a1a1a;
  margin-bottom: 1rem;
`;

const Place = styled.h3`
  color: #333;
  margin-bottom: 0.5rem;
`;

const DateRange = styled.p`
  color: #666;
  font-size: 0.9rem;
`;

const Rating = styled.div`
  margin: 1rem 0;
  color: #ffd700;
  font-size: 1.5rem;
`;

const Description = styled.p`
  color: #444;
  line-height: 1.6;
  margin: 1rem 0;
`;

const Section = styled.div`
  margin: 1.5rem 0;
`;

const SectionTitle = styled.h4`
  color: #333;
  margin-bottom: 0.5rem;
`;

const Tag = styled.span`
  background: #f0f0f0;
  padding: 0.3rem 0.8rem;
  border-radius: 16px;
  margin-right: 0.5rem;
  display: inline-block;
  margin-bottom: 0.5rem;
`;

const PhotoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
  margin: 1rem 0;
`;

const Photo = styled.div`
  img {
    width: 100%;
    height: 200px;
    object-fit: cover;
    border-radius: 8px;
  }
  p {
    margin-top: 0.5rem;
    text-align: center;
  }
`;

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const StarRating = ({ rating }) => {
  return <Rating>{'★'.repeat(rating)}{'☆'.repeat(5-rating)}</Rating>;
};

const JourneyDetail = () => {
  const { id } = useParams();
  const [journey, setJourney] = useState(null);

  useEffect(() => {
    const fetchJourneyDetail = async () => {
      try {
        const response = await fetch(`https://www.api.ankitkaushal.in.net/travel-journeys/${id}`);
        const data = await response.json();
        setJourney(data);
      } catch (error) {
        console.error('Error fetching journey details:', error);
      }
    };

    fetchJourneyDetail();
  }, [id]);

  if (!journey) return <div>Loading...</div>;

  return (
    <DetailContainer>
      <Card>
        <Title>{journey.title}</Title>
        <Place>{journey.place}</Place>
        <DateRange>
          {formatDate(journey.duration.startDate)} - 
          {formatDate(journey.duration.endDate)}
        </DateRange>
        <StarRating rating={journey.rating} />
        <Description>{journey.description}</Description>
        
        <Section>
          <SectionTitle>Mode of Travel:</SectionTitle>
          {journey.modeOfTravel.map((mode, index) => (
            <Tag key={index}>{mode}</Tag>
          ))}
        </Section>

        <Section>
          <SectionTitle>Expense:</SectionTitle>
          <p>{journey.expense.amount} {journey.expense.currency}</p>
        </Section>

        {journey.buddies.length > 0 && (
          <Section>
            <SectionTitle>Travel Buddies:</SectionTitle>
            {journey.buddies.map((buddy) => (
              <Tag key={buddy._id}>
                <a href={buddy.profileLink} target="_blank" rel="noopener noreferrer">
                  {buddy.name}
                </a>
              </Tag>
            ))}
          </Section>
        )}

        {journey.photos.length > 0 && (
          <Section>
            <SectionTitle>Photos:</SectionTitle>
            <PhotoGrid>
              {journey.photos.map((photo) => (
                <Photo key={photo._id}>
                  <img src={photo.url} alt={photo.caption} />
                  <p>{photo.caption}</p>
                </Photo>
              ))}
            </PhotoGrid>
          </Section>
        )}
      </Card>
    </DetailContainer>
  );
};

export default JourneyDetail; 