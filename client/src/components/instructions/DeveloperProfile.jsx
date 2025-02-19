import React, { useState, useEffect } from "react";
import styled from "styled-components";
import CustomModal from "../modal/CustomModal";

const DeveloperProfile = ({ isOpen, onClose, username }) => {
  const [developerData, setDeveloperData] = useState(null);
  const [portfolioData, setPortfolioData] = useState(null);

  useEffect(() => {
    if (username) {
      fetch(`https://api.github.com/users/${username}`)
        .then((response) => response.json())
        .then((data) => setDeveloperData(data))
        .catch((error) =>
          console.error("Error fetching developer data:", error)
        );

      setPortfolioData({
        contact: {
          email: "tanvirimruet@gmail.com",
          linkedin: "https://linkedin.com/in/tanu0",
          facebook: "https://facebook.com/tanu0",
        },
      });
    }
  }, [username]);

  if (!developerData || !portfolioData) {
    return null;
  }

  return (
    <CustomModal open={isOpen} onClose={onClose} title="Developer Profile">
      <ModalContainer>
        <ProfileImage src={developerData.avatar_url} alt="Profile" />
        <ModalHeader>{developerData.name || "No Name Available"}</ModalHeader>
        <Bio>{developerData.bio || "No bio available"}</Bio>

        <Section>
          <SectionTitle>About</SectionTitle>
          <AboutText>
            Hi, I'm Tanvir Mitul, a passionate full-stack developer with
            expertise in building scalable web applications. I love solving
            complex problems and creating user-friendly experiences.
          </AboutText>
        </Section>

        <Section>
          <SectionTitle>GitHub Stats</SectionTitle>
          <InfoList>
            <InfoItem>
              <strong>Username:</strong> {developerData.login}
            </InfoItem>
            <InfoItem>
              <strong>Location:</strong>{" "}
              {developerData.location || "Not available"}
            </InfoItem>
            <InfoItem>
              <strong>Public Repos:</strong> {developerData.public_repos}
            </InfoItem>
            <InfoItem>
              <strong>Followers:</strong> {developerData.followers}
            </InfoItem>
            <InfoItem>
              <strong>Following:</strong> {developerData.following}
            </InfoItem>
            <InfoItem>
              <strong>GitHub:</strong>{" "}
              <ProfileLink
                href={developerData.html_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                View Profile
              </ProfileLink>
            </InfoItem>
          </InfoList>
        </Section>

        <Section>
          <SectionTitle>Contact</SectionTitle>
          <ContactList>
            <ContactItem>
              <strong>Email:</strong> {portfolioData.contact.email}
            </ContactItem>
            <ContactItem>
              <strong>LinkedIn:</strong>{" "}
              <ProfileLink
                href={portfolioData.contact.linkedin}
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn Profile
              </ProfileLink>
            </ContactItem>
            <ContactItem>
              <strong>Facebook:</strong>{" "}
              <ProfileLink
                href={portfolioData.contact.facebook}
                target="_blank"
                rel="noopener noreferrer"
              >
                Facebook Profile
              </ProfileLink>
            </ContactItem>
          </ContactList>
        </Section>
      </ModalContainer>
    </CustomModal>
  );
};

export default DeveloperProfile;

// Styled Components
const ModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 25px;
  border-radius: 12px;

  color: #fff;
  width: 100%;
  max-width: 800px;

  overflow: auto;
  overflow-x: hidden;

  @media (max-width: 768px) {
    max-width: 90%;
    padding: 15px;
  }

  @media (max-width: 480px) {
    max-width: 100%;
    padding: 10px;
  }
`;

const ProfileImage = styled.img`
  width: 140px;
  height: 140px;
  border-radius: 50%;
  border: 4px solid #ff6f61;
  margin-bottom: 15px;
  box-shadow: 0 6px 12px rgba(255, 111, 97, 0.5);

  @media (max-width: 768px) {
    width: 120px;
    height: 120px;
  }

  @media (max-width: 480px) {
    width: 100px;
    height: 100px;
  }
`;

const ModalHeader = styled.h2`
  font-size: 1.8rem;
  font-weight: bold;
  color: #ff6f61;
  margin-bottom: 8px;

  @media (max-width: 768px) {
    font-size: 1.6rem;
  }

  @media (max-width: 480px) {
    font-size: 1.4rem;
  }
`;

const Bio = styled.p`
  font-size: 1rem;
  text-align: center;
  color: #ddd;
  font-style: italic;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }

  @media (max-width: 480px) {
    font-size: 0.8rem;
  }
`;

const Section = styled.div`
  width: 100%;
  margin-bottom: 20px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  padding: 5px;
`;

const SectionTitle = styled.h3`
  font-size: 1.4rem;
  color: #ff6f61;
  text-align: center;
  font-weight: bold;
  margin-bottom: 10px;

  @media (max-width: 768px) {
    font-size: 1.2rem;
  }

  @media (max-width: 480px) {
    font-size: 1.1rem;
  }
`;

const AboutText = styled.p`
  text-align: center;
  font-size: 1rem;
  color: #f5f5f5;
  line-height: 1.6;

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }

  @media (max-width: 480px) {
    font-size: 0.8rem;
  }
`;

const InfoList = styled.ul`
  list-style: none;
  padding: 0;
  width: 100%;
`;

const InfoItem = styled.li`
  display: flex;
  justify-content: space-between;
  padding: 8px 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 1rem;
  color: #f5f5f5;

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }

  @media (max-width: 480px) {
    font-size: 0.8rem;
  }
`;

const ContactList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
`;

const ContactItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 8px 12px;
  color: #f5f5f5;

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }

  @media (max-width: 480px) {
    font-size: 0.8rem;
  }
`;

const ProfileLink = styled.a`
  color: #00d1b2;
  font-weight: bold;
  text-decoration: none;
  transition: 0.3s ease-in-out;
  &:hover {
    color: #00ffea;
    text-decoration: underline;
  }
`;
