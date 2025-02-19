import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import styled from "styled-components";
import CustomModal from "../modal/CustomModal";

const DeveloperProfile = ({ isOpen, onClose, username }) => {
  const [developerData, setDeveloperData] = useState(null);
  const [portfolioData, setPortfolioData] = useState(null);

  useEffect(() => {
    if (username) {
      // Fetch GitHub data
      fetch(`https://api.github.com/users/${username}`)
        .then((response) => response.json())
        .then((data) => setDeveloperData(data))
        .catch((error) =>
          console.error("Error fetching developer data:", error)
        );

      // Fetch portfolio data (mock data based on the provided portfolio link)
      const mockPortfolioData = {
        skills: [
          "JavaScript",
          "React",
          "Node.js",
          "Express",
          "MongoDB",
          "Php",
          "Laravel",
          "MySQL",
        ],
        projects: [
          {
            name: "E-commerce Platform",
            description:
              "A full-stack e-commerce platform with user authentication, product management, and payment integration.",
            link: "https://example.com",
          },
          {
            name: "Portfolio Website",
            description:
              "A responsive portfolio website showcasing projects, skills, and contact information.",
            link: "https://tanvir-mitul.netlify.app/",
          },
        ],
        contact: {
          email: "tanvir.mitul@example.com",
          linkedin: "https://linkedin.com/in/tanvir-mitul",
          twitter: "https://twitter.com/tanvir_mitul",
        },
      };
      setPortfolioData(mockPortfolioData);
    }
  }, [username]);

  if (!developerData || !portfolioData) {
    return null;
  }

  return (
    <CustomModal open={isOpen} onClose={onClose} title="Developer Profile">
      <ModalContainer>
        <ProfileImage
          src={developerData.avatar_url}
          alt={`${developerData.name}'s avatar`}
        />
        <ModalHeader>{developerData.name}</ModalHeader>
        <Bio>{developerData.bio}</Bio>

        <SectionTitle>About Me</SectionTitle>
        <AboutText>
          Hi, I'm Tanvir Mitul, a passionate full-stack developer with expertise
          in building scalable web applications. I love solving complex problems
          and creating user-friendly experiences.
        </AboutText>

        <SectionTitle>Skills</SectionTitle>
        <SkillsContainer>
          {portfolioData.skills.map((skill, index) => (
            <Skill key={index}>{skill}</Skill>
          ))}
        </SkillsContainer>

        <SectionTitle>Contact</SectionTitle>
        <ContactContainer>
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
              {portfolioData.contact.linkedin}
            </ProfileLink>
          </ContactItem>
          <ContactItem>
            <strong>Twitter:</strong>{" "}
            <ProfileLink
              href={portfolioData.contact.twitter}
              target="_blank"
              rel="noopener noreferrer"
            >
              {portfolioData.contact.twitter}
            </ProfileLink>
          </ContactItem>
        </ContactContainer>

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
            <strong>GitHub Profile:</strong>{" "}
            <ProfileLink
              href={developerData.html_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {developerData.html_url}
            </ProfileLink>
          </InfoItem>
        </InfoList>
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
  padding: 20px;
  border-radius: 10px;
  color: #f5f5f5;
`;

const ProfileImage = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  margin-bottom: 20px;
  border: 3px solid #ff6f61;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
`;

const ModalHeader = styled.h2`
  color: #ff6f61;
  font-size: 1.8rem;
  margin-bottom: 10px;
  text-align: center;
  font-weight: bold;
`;

const Bio = styled.p`
  font-style: italic;
  text-align: center;
  margin-bottom: 20px;
  color: #ddd;
`;

const SectionTitle = styled.h3`
  color: #ff6f61;
  font-size: 1.5rem;
  margin: 20px 0 10px;
  text-align: center;
  font-weight: bold;
`;

const AboutText = styled.p`
  text-align: center;
  margin-bottom: 20px;
  color: #f5f5f5;
  line-height: 1.6;
`;

const SkillsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
`;

const Skill = styled.span`
  background: #ff6f61;
  color: #fff;
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 0.9rem;
`;

const ProjectsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 20px;
`;

const Project = styled.div`
  background: #2a2a40;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
`;

const ProjectName = styled.h4`
  color: #ff6f61;
  margin-bottom: 5px;
`;

const ProjectDescription = styled.p`
  color: #ddd;
  margin-bottom: 10px;
`;

const ProjectLink = styled.a`
  color: #00d1b2;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

const ContactContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
`;

const ContactItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0 10px;
  color: #f5f5f5;
`;

const InfoList = styled.ul`
  list-style: none;
  padding: 0;
  width: 100%;
`;

const InfoItem = styled.li`
  margin-bottom: 10px;
  font-size: 1rem;
  line-height: 1.6;
  color: #f5f5f5;
  display: flex;
  justify-content: space-between;
  padding: 0 10px;
`;

const ProfileLink = styled.a`
  color: #00d1b2;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;
