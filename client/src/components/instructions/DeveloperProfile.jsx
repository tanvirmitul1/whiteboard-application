import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useTheme } from "@mui/material/styles";
import CustomModal from "../modal/CustomModal";

const DeveloperProfile = ({ isOpen, onClose, username }) => {
  const theme = useTheme();
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
      <ModalContainer theme={theme}>
        <ProfileImage
          src={developerData.avatar_url}
          alt="Profile"
          theme={theme}
        />
        <ModalHeader theme={theme}>
          {developerData.name || "No Name Available"}
        </ModalHeader>
        <Bio theme={theme}>{developerData.bio || "No bio available"}</Bio>

        <Section theme={theme}>
          <AboutText theme={theme}>
            Hi, I'm Tanvir Mitul, a passionate full-stack developer with
            expertise in building scalable web applications. I love solving
            complex problems and creating user-friendly experiences.
          </AboutText>
        </Section>
        <Section theme={theme}>
          <SectionTitle theme={theme}>Contact</SectionTitle>
          <ContactList>
            <ContactItem theme={theme}>
              <strong>Email:</strong> {portfolioData.contact.email}
            </ContactItem>
            <ContactItem theme={theme}>
              <strong>LinkedIn:</strong>{" "}
              <ProfileLink
                theme={theme}
                href={portfolioData.contact.linkedin}
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn Profile
              </ProfileLink>
            </ContactItem>
            <ContactItem theme={theme}>
              <strong>Facebook:</strong>{" "}
              <ProfileLink
                theme={theme}
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

// Styled Components with Theme Support
const ModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 25px;
  border-radius: 12px;
  color: ${({ theme }) => theme.palette.text.primary};
  background: ${({ theme }) => theme.palette.background.default};
  width: 100%;
  max-width: 800px;
  overflow: auto;
`;

const ProfileImage = styled.img`
  width: 140px;
  height: 140px;
  border-radius: 50%;
  border: 4px solid ${({ theme }) => theme.palette.primary.main};
  margin-bottom: 15px;
  box-shadow: 0 6px 12px ${({ theme }) => theme.palette.primary.light};
`;

const ModalHeader = styled.h2`
  font-size: 1.8rem;
  font-weight: bold;
  color: ${({ theme }) => theme.palette.primary.main};
  margin-bottom: 8px;
`;

const Bio = styled.p`
  font-size: 1rem;
  text-align: center;
  color: ${({ theme }) => theme.palette.text.secondary};
  font-style: italic;
  margin-bottom: 20px;
`;

const Section = styled.div`
  width: 100%;
  margin-bottom: 20px;
  background: ${({ theme }) => theme.palette.action.hover};
  border-radius: 10px;
  padding: 5px;
`;

const SectionTitle = styled.h3`
  font-size: 1.4rem;
  color: ${({ theme }) => theme.palette.secondary.main};
  text-align: center;
  font-weight: bold;
  margin-bottom: 10px;
`;

const AboutText = styled.p`
  text-align: center;
  font-size: 1rem;
  color: ${({ theme }) => theme.palette.text.primary};
  line-height: 1.6;
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
  color: ${({ theme }) => theme.palette.text.primary};

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }

  @media (max-width: 480px) {
    font-size: 0.8rem;
  }
`;

const ProfileLink = styled.a`
  color: ${({ theme }) => theme.palette.primary.main};
  font-weight: bold;
  text-decoration: none;
  transition: 0.3s ease-in-out;
  &:hover {
    color: ${({ theme }) => theme.palette.secondary.main};
    text-decoration: underline;
  }
`;
