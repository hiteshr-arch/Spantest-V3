import { useState } from "react";
import { Select, Popover } from "antd";
import { LogoutOutlined, UserOutlined, SettingOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router";
import { projects, currentUser, tokensRemaining } from "../../lib/mock-data";

export function Header() {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const [profileOpen, setProfileOpen] = useState(false);

  const projectOptions = projects.map((p) => ({ label: p.name, value: p.id }));

  const handleProjectChange = (value: string) => {
    navigate(`/project/${value}/generator`);
  };

  const profileContent = (
    <div className="flex flex-col w-[200px]">
      <div className="px-3 py-3 border-b border-[#f3f0fb]">
        <p className="header__profile-name">
          {currentUser.name}
        </p>
        <p className="header__profile-email">
          {currentUser.email}
        </p>
      </div>
      <div className="flex flex-col py-1">
        <button className="header__profile-item">
          <UserOutlined style={{ fontSize: 14 }} />
          <span>My Profile</span>
        </button>
        <button className="header__profile-item">
          <SettingOutlined style={{ fontSize: 14 }} />
          <span>Settings</span>
        </button>
        <button className="header__profile-item header__profile-item--danger">
          <LogoutOutlined style={{ fontSize: 14 }} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <header className="header flex items-center justify-between px-6 py-3 bg-white border-b border-[#f3f0fb]">
      <div className="header__left flex items-center gap-6">
        <span
          onClick={() => navigate("/")}
          className="header__logo"
        >
          Spantest+
        </span>
        <div className="flex items-center gap-1">
          {projectId && (
            <>
              <span className="header__project-label">
                PROJECT
              </span>
              <Select
                value={projectId}
                onChange={handleProjectChange}
                options={projectOptions}
                variant="borderless"
                className="header__project-select"
                style={{ minWidth: 140 }}
                popupMatchSelectWidth={false}
              />
            </>
          )}
        </div>
      </div>

      <div className="header__right flex items-center gap-3">
        <div className="header__token-badge flex items-center gap-[6px] px-3 py-2 rounded-full">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <circle cx="5" cy="5" r="4.5" stroke="#7C3AED" />
            <circle cx="5" cy="5" r="2" fill="#7C3AED" />
          </svg>
          <span className="header__token-badge-text">
            {tokensRemaining} tokens
          </span>
        </div>

        <Popover
          content={profileContent}
          trigger="click"
          open={profileOpen}
          onOpenChange={setProfileOpen}
          placement="bottomRight"
          arrow={false}
        >
          <button
            className="header__avatar flex items-center justify-center size-8 rounded-full"
          >
            {currentUser.initials}
          </button>
        </Popover>
      </div>
    </header>
  );
}
