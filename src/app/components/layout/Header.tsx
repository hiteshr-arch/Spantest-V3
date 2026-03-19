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
        <p className="font-['Bricolage_Grotesque',sans-serif] text-[#0f0a1e] text-[14px]" style={{ fontWeight: 600 }}>
          {currentUser.name}
        </p>
        <p className="font-['DM_Sans',sans-serif] text-[#8b87a0] text-[12px]">
          {currentUser.email}
        </p>
      </div>
      <div className="flex flex-col py-1">
        <button className="header__profile-item flex items-center gap-2 px-3 py-2 text-[#4c4568] hover:bg-[#faf5ff] text-left cursor-pointer border-0 bg-transparent">
          <UserOutlined style={{ fontSize: 14 }} />
          <span className="font-['DM_Sans',sans-serif] text-[13px]">My Profile</span>
        </button>
        <button className="header__profile-item flex items-center gap-2 px-3 py-2 text-[#4c4568] hover:bg-[#faf5ff] text-left cursor-pointer border-0 bg-transparent">
          <SettingOutlined style={{ fontSize: 14 }} />
          <span className="font-['DM_Sans',sans-serif] text-[13px]">Settings</span>
        </button>
        <button className="header__profile-item flex items-center gap-2 px-3 py-2 text-[#d4183d] hover:bg-[#fff5f5] text-left cursor-pointer border-0 bg-transparent">
          <LogoutOutlined style={{ fontSize: 14 }} />
          <span className="font-['DM_Sans',sans-serif] text-[13px]">Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <header className="header flex items-center justify-between px-6 py-3 bg-white border-b border-[#f3f0fb]">
      <div className="header__left flex items-center gap-6">
        <span
          onClick={() => navigate("/")}
          className="font-['Bricolage_Grotesque',sans-serif] text-[#7c3aed] text-[17px] tracking-[-0.51px] whitespace-nowrap cursor-pointer"
          style={{ fontWeight: 800 }}
        >
          Spantest+
        </span>
        <div className="flex items-center gap-1">
          {projectId && (
            <>
              <span className="font-['DM_Sans',sans-serif] text-[#8b87a0] text-[12px]" style={{ fontWeight: 500 }}>
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
        <div className="header__token-badge flex items-center gap-[6px] px-3 py-2 rounded-full bg-[#faf9ff] border border-[rgba(124,58,237,0.1)]">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <circle cx="5" cy="5" r="4.5" stroke="#7C3AED" />
            <circle cx="5" cy="5" r="2" fill="#7C3AED" />
          </svg>
          <span className="font-['Bricolage_Grotesque',sans-serif] text-[#7c3aed] text-[11.5px] tracking-[0.115px] whitespace-nowrap" style={{ fontWeight: 600 }}>
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
            className="header__avatar flex items-center justify-center size-8 rounded-full text-white text-[11px] cursor-pointer border-0"
            style={{ background: "linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)", fontWeight: 700, fontFamily: "'Bricolage Grotesque', sans-serif" }}
          >
            {currentUser.initials}
          </button>
        </Popover>
      </div>
    </header>
  );
}