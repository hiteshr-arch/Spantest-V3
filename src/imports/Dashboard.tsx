import svgPaths from "./svg-amrug09u94";

function ShellLayout() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-[73px]" data-name="ShellLayout">
      <p className="font-['Bricolage_Grotesque:96pt_ExtraBold',sans-serif] font-extrabold leading-[17px] relative shrink-0 text-[#7c3aed] text-[17px] text-center tracking-[-0.51px] whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 96, 'wdth' 100" }}>
        Spantest+
      </p>
    </div>
  );
}

function TextInput() {
  return (
    <div className="bg-white h-[32px] relative rounded-[8px] shrink-0" data-name="Text Input">
      <div className="content-stretch flex gap-[12px] h-full items-center overflow-clip px-[12px] py-[4px] relative rounded-[inherit]">
        <p className="font-['DM_Sans:9pt_Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[#4c4568] text-[14px] whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
          Placeholder
        </p>
        <div className="relative shrink-0 size-[14px]" data-name="react-icons/ai/AiOutlineDown">
          <div className="absolute bottom-1/4 left-[12.89%] right-[12.89%] top-1/4" data-name="Vector">
            <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.3905 7">
              <path d={svgPaths.p2397fab0} fill="var(--fill-0, #8B87A0)" id="Vector" />
            </svg>
          </div>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#f3f0fb] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Frame11() {
  return (
    <div className="relative shrink-0 w-[710px]">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[24px] items-center relative w-full">
        <ShellLayout />
        <TextInput />
      </div>
    </div>
  );
}

function Icon() {
  return (
    <div className="relative shrink-0 size-[10px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 10">
        <g clipPath="url(#clip0_2_329)" id="Icon">
          <path d={svgPaths.p1cf2eff1} id="Vector" stroke="var(--stroke-0, #7C3AED)" />
          <path d={svgPaths.p1a397700} fill="var(--fill-0, #7C3AED)" id="Vector_2" />
        </g>
        <defs>
          <clipPath id="clip0_2_329">
            <rect fill="white" height="10" width="10" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function TokenBadge() {
  return (
    <div className="bg-[#faf9ff] relative rounded-[999px] shrink-0" data-name="TokenBadge">
      <div aria-hidden="true" className="absolute border border-[rgba(124,58,237,0.1)] border-solid inset-0 pointer-events-none rounded-[999px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[6px] items-center px-[12px] py-[8px] relative">
        <Icon />
        <p className="font-['Bricolage_Grotesque:SemiBold',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[#7c3aed] text-[11.5px] text-center tracking-[0.115px] whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14, 'wdth' 100" }}>
          240 tokens
        </p>
      </div>
    </div>
  );
}

function Button() {
  return (
    <div className="relative rounded-[999px] shrink-0 size-[32px]" data-name="Button" style={{ backgroundImage: "linear-gradient(135deg, rgb(124, 58, 237) 0%, rgb(168, 85, 247) 100%)" }}>
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <p className="font-['Bricolage_Grotesque:Bold',sans-serif] font-bold leading-[normal] relative shrink-0 text-[11px] text-center text-white whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14, 'wdth' 100" }}>
          JD
        </p>
      </div>
    </div>
  );
}

function ShellLayout1() {
  return (
    <div className="h-[32px] relative shrink-0" data-name="ShellLayout">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[10px] h-full items-center relative">
        <TokenBadge />
        <Button />
      </div>
    </div>
  );
}

function Frame15() {
  return (
    <div className="content-stretch flex gap-px items-center relative shrink-0">
      <p className="relative shrink-0" style={{ fontVariationSettings: "'opsz' 9, 'opsz' 9" }}>
        /
      </p>
      <p className="relative shrink-0" style={{ fontVariationSettings: "'opsz' 9, 'opsz' 9" }}>
        Dashboard
      </p>
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex font-['DM_Sans:9pt_Regular',sans-serif] font-semibold gap-px items-start leading-[normal] relative shrink-0 text-[#c0bcd1] text-[12px] whitespace-nowrap">
      <p className="relative shrink-0" style={{ fontVariationSettings: "'opsz' 9, 'opsz' 9" }}>
        Projects
      </p>
      <Frame15 />
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex flex-col gap-px items-start relative shrink-0 w-full">
      <p className="font-['Bricolage_Grotesque:SemiBold',sans-serif] font-semibold leading-[32px] relative shrink-0 text-[#0f0a1e] text-[24px] tracking-[-0.72px] w-full" style={{ fontVariationSettings: "'opsz' 14, 'wdth' 100" }}>
        Project dashboard
      </p>
      <p className="font-['DM_Sans:9pt_Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[#8b87a0] text-[14px] w-full" style={{ fontVariationSettings: "'opsz' 9" }}>
        A snapshot of your recent projects, test counts, and activity.
      </p>
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-px items-start min-h-px min-w-px relative">
      <Frame1 />
      <Frame />
    </div>
  );
}

function TextInput1() {
  return (
    <div className="bg-white flex-[1_0_0] min-h-px min-w-px relative rounded-[8px] w-[318px]" data-name="Text Input">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex gap-[8px] items-center px-[12px] py-[8px] relative size-full">
          <div className="relative shrink-0 size-[14px]" data-name="react-icons/ai/AiOutlineSearch">
            <div className="absolute inset-[10.94%]" data-name="Vector">
              <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.9375 10.9375">
                <path d={svgPaths.p3d27e800} fill="var(--fill-0, #0F0A1E)" id="Vector" />
              </svg>
            </div>
          </div>
          <p className="flex-[1_0_0] font-['DM_Sans:9pt_Regular',sans-serif] font-normal leading-[normal] min-h-px min-w-px relative text-[#8b87a0] text-[14px]" style={{ fontVariationSettings: "'opsz' 9" }}>
            Search projects...
          </p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#f3f0fb] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function AntdIcon() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="AntdIcon">
      <div className="absolute left-0 size-[14px] top-0" data-name="react-icons/ai/AiOutlinePlus">
        <div className="absolute inset-[14.84%_46.29%]" data-name="Vector">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.03906 9.84375">
            <path d={svgPaths.p17be2600} fill="var(--fill-0, white)" id="Vector" />
          </svg>
        </div>
        <div className="absolute inset-[46.29%_16.41%]" data-name="Vector">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.40625 1.03906">
            <path d={svgPaths.p132b7100} fill="var(--fill-0, white)" id="Vector" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex gap-[12px] items-start relative shrink-0">
      <div className="content-stretch flex flex-col items-start relative self-stretch shrink-0" data-name="Placeholder">
        <TextInput1 />
      </div>
      <div className="bg-[#7c3aed] content-stretch flex gap-[4px] items-center justify-center px-[12px] py-[8px] relative rounded-[8px] shrink-0" data-name="Button">
        <AntdIcon />
        <p className="font-['DM_Sans:9pt_Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[14px] text-center text-white whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
          New Project
        </p>
      </div>
    </div>
  );
}

function Container() {
  return (
    <div className="content-stretch flex flex-col gap-[6px] h-[56px] items-start relative shrink-0 w-full whitespace-nowrap" data-name="Container">
      <p className="font-['Bricolage_Grotesque:96pt_ExtraBold',sans-serif] font-extrabold leading-[34px] relative shrink-0 text-[#0f0a1e] text-[34px] tracking-[-1.02px]" style={{ fontVariationSettings: "'opsz' 96, 'wdth' 100" }}>
        3
      </p>
      <p className="font-['DM_Sans:9pt_Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[#8b87a0] text-[12px]" style={{ fontVariationSettings: "'opsz' 9" }}>
        Across all teams
      </p>
    </div>
  );
}

function Frame17() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[12px] items-start min-h-px min-w-px relative">
      <p className="font-['Bricolage_Grotesque:Bold',sans-serif] font-bold leading-[normal] relative shrink-0 text-[#8b87a0] text-[10.5px] tracking-[0.84px] uppercase w-full" style={{ fontVariationSettings: "'opsz' 14, 'wdth' 100" }}>
        Total Projects
      </p>
      <Container />
    </div>
  );
}

function TextInput2() {
  return (
    <div className="bg-white h-[32px] relative rounded-[8px] shrink-0" data-name="Text Input">
      <div className="content-stretch flex gap-[12px] h-full items-center overflow-clip px-[12px] py-[4px] relative rounded-[inherit]">
        <p className="font-['DM_Sans:9pt_Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[#4c4568] text-[14px] whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
          All Project
        </p>
        <div className="relative shrink-0 size-[14px]" data-name="react-icons/ai/AiOutlineDown">
          <div className="absolute bottom-1/4 left-[12.89%] right-[12.89%] top-1/4" data-name="Vector">
            <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.3905 7">
              <path d={svgPaths.p2397fab0} fill="var(--fill-0, #8B87A0)" id="Vector" />
            </svg>
          </div>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#f3f0fb] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Container1() {
  return (
    <div className="content-stretch flex flex-col gap-[6px] h-[56px] items-start relative shrink-0 w-full whitespace-nowrap" data-name="Container">
      <p className="font-['Bricolage_Grotesque:96pt_ExtraBold',sans-serif] font-extrabold leading-[34px] relative shrink-0 text-[#0f0a1e] text-[34px] tracking-[-1.02px]" style={{ fontVariationSettings: "'opsz' 96, 'wdth' 100" }}>
        142
      </p>
      <p className="font-['DM_Sans:9pt_Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[#8b87a0] text-[12px]" style={{ fontVariationSettings: "'opsz' 9" }}>
        All active suites
      </p>
    </div>
  );
}

function Frame18() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[12px] items-start min-h-px min-w-px relative">
      <p className="font-['Bricolage_Grotesque:Bold',sans-serif] font-bold leading-[normal] relative shrink-0 text-[#8b87a0] text-[10.5px] tracking-[0.84px] uppercase w-full" style={{ fontVariationSettings: "'opsz' 14, 'wdth' 100" }}>
        Test Cases
      </p>
      <Container1 />
    </div>
  );
}

function Container2() {
  return (
    <div className="content-stretch flex flex-col gap-[6px] h-[56px] items-start relative shrink-0 w-full whitespace-nowrap" data-name="Container">
      <p className="font-['Bricolage_Grotesque:96pt_ExtraBold',sans-serif] font-extrabold leading-[34px] relative shrink-0 text-[#0f0a1e] text-[34px] tracking-[-1.02px]" style={{ fontVariationSettings: "'opsz' 96, 'wdth' 100" }}>
        89
      </p>
      <p className="font-['DM_Sans:9pt_Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[#8b87a0] text-[12px]" style={{ fontVariationSettings: "'opsz' 9" }}>
        This month
      </p>
    </div>
  );
}

function Frame19() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[12px] items-start min-h-px min-w-px relative">
      <p className="font-['Bricolage_Grotesque:Bold',sans-serif] font-bold leading-[normal] relative shrink-0 text-[#8b87a0] text-[10.5px] tracking-[0.84px] uppercase w-full" style={{ fontVariationSettings: "'opsz' 14, 'wdth' 100" }}>
        Scripts Generated
      </p>
      <Container2 />
    </div>
  );
}

function Container3() {
  return (
    <div className="content-stretch flex flex-col gap-[6px] h-[56px] items-start relative shrink-0 w-full whitespace-nowrap" data-name="Container">
      <p className="font-['Bricolage_Grotesque:96pt_ExtraBold',sans-serif] font-extrabold leading-[34px] relative shrink-0 text-[#0f0a1e] text-[34px] tracking-[-1.02px]" style={{ fontVariationSettings: "'opsz' 96, 'wdth' 100" }}>
        240
      </p>
      <p className="font-['DM_Sans:9pt_Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[#8b87a0] text-[12px]" style={{ fontVariationSettings: "'opsz' 9" }}>
        Buy more tokens
      </p>
    </div>
  );
}

function Frame20() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[12px] items-start min-h-px min-w-px relative">
      <p className="font-['Bricolage_Grotesque:Bold',sans-serif] font-bold leading-[normal] relative shrink-0 text-[#8b87a0] text-[10.5px] tracking-[0.84px] uppercase w-full" style={{ fontVariationSettings: "'opsz' 14, 'wdth' 100" }}>
        Tokens Remaining
      </p>
      <Container3 />
    </div>
  );
}

function Frame8() {
  return (
    <div className="content-stretch flex gap-[24px] items-start relative shrink-0 w-full">
      <div className="bg-white flex-[1_0_0] min-h-px min-w-px relative rounded-[16px]" data-name="StatCard">
        <div className="overflow-clip rounded-[inherit] size-full">
          <div className="content-stretch flex gap-[12px] items-start px-[24px] py-[14px] relative w-full">
            <Frame17 />
            <TextInput2 />
          </div>
        </div>
        <div aria-hidden="true" className="absolute border-[#7c3aed] border-l-3 border-solid inset-0 pointer-events-none rounded-[16px] shadow-[0px_1px_4px_0px_rgba(124,58,237,0.06),0px_1px_2px_0px_rgba(0,0,0,0.04)]" />
      </div>
      <div className="bg-white flex-[1_0_0] min-h-px min-w-px relative rounded-[16px]" data-name="StatCard">
        <div className="overflow-clip rounded-[inherit] size-full">
          <div className="content-stretch flex gap-[12px] items-start px-[24px] py-[14px] relative w-full">
            <Frame18 />
          </div>
        </div>
        <div aria-hidden="true" className="absolute border-[#16a34a] border-l-3 border-solid inset-0 pointer-events-none rounded-[16px] shadow-[0px_1px_4px_0px_rgba(124,58,237,0.06),0px_1px_2px_0px_rgba(0,0,0,0.04)]" />
      </div>
      <div className="bg-white flex-[1_0_0] min-h-px min-w-px relative rounded-[16px]" data-name="StatCard">
        <div className="overflow-clip rounded-[inherit] size-full">
          <div className="content-stretch flex gap-[12px] items-start px-[24px] py-[14px] relative w-full">
            <Frame19 />
          </div>
        </div>
        <div aria-hidden="true" className="absolute border-[#f59e0b] border-l-3 border-solid inset-0 pointer-events-none rounded-[16px] shadow-[0px_1px_4px_0px_rgba(124,58,237,0.06),0px_1px_2px_0px_rgba(0,0,0,0.04)]" />
      </div>
      <div className="bg-white flex-[1_0_0] min-h-px min-w-px relative rounded-[16px]" data-name="StatCard">
        <div className="overflow-clip rounded-[inherit] size-full">
          <div className="content-stretch flex gap-[12px] items-start px-[24px] py-[14px] relative w-full">
            <Frame20 />
          </div>
        </div>
        <div aria-hidden="true" className="absolute border-[#2563eb] border-l-3 border-solid inset-0 pointer-events-none rounded-[16px] shadow-[0px_1px_4px_0px_rgba(124,58,237,0.06),0px_1px_2px_0px_rgba(0,0,0,0.04)]" />
      </div>
    </div>
  );
}

function Frame10() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
      <Frame8 />
    </div>
  );
}

function Text() {
  return (
    <div className="h-[17px] relative shrink-0 w-[117.188px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="font-['Bricolage_Grotesque:Bold',sans-serif] font-bold leading-[normal] relative shrink-0 text-[#0f0a1e] text-[14px] tracking-[-0.14px] whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14, 'wdth' 100" }}>
          E-Commerce App
        </p>
      </div>
    </div>
  );
}

function Text2() {
  return <div className="bg-[#16a34a] rounded-[999px] shrink-0 size-[5px]" data-name="Text" />;
}

function Text1() {
  return (
    <div className="bg-[rgba(22,163,74,0.08)] relative rounded-[999px] shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[4px] items-center px-[8px] py-[4px] relative">
        <Text2 />
        <p className="font-['DM_Sans:9pt_Regular',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[#16a34a] text-[12px] whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9, 'opsz' 9" }}>
          Active
        </p>
      </div>
    </div>
  );
}

function Container4() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Text />
      <Text1 />
    </div>
  );
}

function Frame4() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
      <Container4 />
      <p className="font-['DM_Sans:9pt_Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[#8b87a0] text-[14px] whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
        Last active 2h ago · 54 test cases
      </p>
    </div>
  );
}

function Text3() {
  return (
    <div className="bg-[rgba(124,58,237,0.1)] relative rounded-[999px] shrink-0 w-full" data-name="Text">
      <div aria-hidden="true" className="absolute border border-[rgba(124,58,237,0.1)] border-solid inset-0 pointer-events-none rounded-[999px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center px-[9px] py-[5px] relative w-full">
          <p className="font-['DM_Sans:9pt_Regular',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[#7c3aed] text-[12px] whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9, 'opsz' 9" }}>
            Cypress
          </p>
        </div>
      </div>
    </div>
  );
}

function Frame5() {
  return (
    <div className="content-stretch flex flex-col items-start justify-center relative shrink-0 w-[64.125px]">
      <Text3 />
    </div>
  );
}

function Text4() {
  return (
    <div className="bg-[rgba(124,58,237,0.1)] content-stretch flex items-center px-[9px] py-[5px] relative rounded-[999px] shrink-0" data-name="Text">
      <div aria-hidden="true" className="absolute border border-[rgba(124,58,237,0.1)] border-solid inset-0 pointer-events-none rounded-[999px]" />
      <p className="font-['DM_Sans:9pt_Regular',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[#7c3aed] text-[12px] whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9, 'opsz' 9" }}>
        Playwright
      </p>
    </div>
  );
}

function Container5() {
  return (
    <div className="content-stretch flex gap-[12px] items-center relative shrink-0" data-name="Container">
      <Frame5 />
      <Text4 />
    </div>
  );
}

function Text5() {
  return (
    <div className="h-[17px] relative shrink-0 w-[117.188px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="font-['Bricolage_Grotesque:Bold',sans-serif] font-bold leading-[normal] relative shrink-0 text-[#0f0a1e] text-[14px] tracking-[-0.14px] whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14, 'wdth' 100" }}>
          Auth Service
        </p>
      </div>
    </div>
  );
}

function Text7() {
  return <div className="bg-[#16a34a] rounded-[999px] shrink-0 size-[5px]" data-name="Text" />;
}

function Text6() {
  return (
    <div className="bg-[rgba(22,163,74,0.08)] relative rounded-[999px] shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[4px] items-center px-[8px] py-[4px] relative">
        <Text7 />
        <p className="font-['DM_Sans:9pt_Regular',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[#16a34a] text-[12px] whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9, 'opsz' 9" }}>
          Active
        </p>
      </div>
    </div>
  );
}

function Container6() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Text5 />
      <Text6 />
    </div>
  );
}

function Frame6() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
      <Container6 />
      <p className="font-['DM_Sans:9pt_Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[#8b87a0] text-[14px] whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
        Last active 2h ago · 54 test cases
      </p>
    </div>
  );
}

function Text8() {
  return (
    <div className="bg-[rgba(124,58,237,0.1)] relative rounded-[999px] shrink-0 w-full" data-name="Text">
      <div aria-hidden="true" className="absolute border border-[rgba(124,58,237,0.1)] border-solid inset-0 pointer-events-none rounded-[999px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center px-[9px] py-[5px] relative w-full">
          <p className="font-['DM_Sans:9pt_Regular',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[#7c3aed] text-[12px] whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9, 'opsz' 9" }}>
            Cypress
          </p>
        </div>
      </div>
    </div>
  );
}

function Frame7() {
  return (
    <div className="content-stretch flex flex-col items-start justify-center relative shrink-0 w-[64.125px]">
      <Text8 />
    </div>
  );
}

function Text9() {
  return (
    <div className="bg-[rgba(124,58,237,0.1)] content-stretch flex items-center px-[9px] py-[5px] relative rounded-[999px] shrink-0" data-name="Text">
      <div aria-hidden="true" className="absolute border border-[rgba(124,58,237,0.1)] border-solid inset-0 pointer-events-none rounded-[999px]" />
      <p className="font-['DM_Sans:9pt_Regular',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[#7c3aed] text-[12px] whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9, 'opsz' 9" }}>
        Playwright
      </p>
    </div>
  );
}

function Container7() {
  return (
    <div className="content-stretch flex gap-[12px] items-center relative shrink-0" data-name="Container">
      <Frame7 />
      <Text9 />
    </div>
  );
}

function Text10() {
  return (
    <div className="h-[17px] relative shrink-0 w-[117.188px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="font-['Bricolage_Grotesque:Bold',sans-serif] font-bold leading-[normal] relative shrink-0 text-[#0f0a1e] text-[14px] tracking-[-0.14px] whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 14, 'wdth' 100" }}>
          Mobile API
        </p>
      </div>
    </div>
  );
}

function Text12() {
  return <div className="bg-[#16a34a] rounded-[999px] shrink-0 size-[5px]" data-name="Text" />;
}

function Text11() {
  return (
    <div className="bg-[rgba(22,163,74,0.08)] relative rounded-[999px] shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[4px] items-center px-[8px] py-[4px] relative">
        <Text12 />
        <p className="font-['DM_Sans:9pt_Regular',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[#16a34a] text-[12px] whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9, 'opsz' 9" }}>
          Active
        </p>
      </div>
    </div>
  );
}

function Container8() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Text10 />
      <Text11 />
    </div>
  );
}

function Frame13() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] h-[50px] items-start relative shrink-0 w-full">
      <Container8 />
      <p className="font-['DM_Sans:9pt_Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[#8b87a0] text-[14px] whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9" }}>
        Last active 2h ago · 54 test cases
      </p>
    </div>
  );
}

function Text13() {
  return (
    <div className="bg-[rgba(124,58,237,0.1)] relative rounded-[999px] shrink-0 w-full" data-name="Text">
      <div aria-hidden="true" className="absolute border border-[rgba(124,58,237,0.1)] border-solid inset-0 pointer-events-none rounded-[999px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center px-[9px] py-[5px] relative w-full">
          <p className="font-['DM_Sans:9pt_Regular',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[#7c3aed] text-[12px] whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9, 'opsz' 9" }}>
            Cypress
          </p>
        </div>
      </div>
    </div>
  );
}

function Frame14() {
  return (
    <div className="content-stretch flex flex-col items-start justify-center relative shrink-0 w-[64.125px]">
      <Text13 />
    </div>
  );
}

function Text14() {
  return (
    <div className="bg-[rgba(124,58,237,0.1)] content-stretch flex items-center px-[9px] py-[5px] relative rounded-[999px] shrink-0" data-name="Text">
      <div aria-hidden="true" className="absolute border border-[rgba(124,58,237,0.1)] border-solid inset-0 pointer-events-none rounded-[999px]" />
      <p className="font-['DM_Sans:9pt_Regular',sans-serif] font-semibold leading-[normal] relative shrink-0 text-[#7c3aed] text-[12px] whitespace-nowrap" style={{ fontVariationSettings: "'opsz' 9, 'opsz' 9" }}>
        Playwright
      </p>
    </div>
  );
}

function Container9() {
  return (
    <div className="content-stretch flex gap-[12px] items-center relative shrink-0" data-name="Container">
      <Frame14 />
      <Text14 />
    </div>
  );
}

function Frame9() {
  return (
    <div className="content-stretch flex gap-[24px] items-start relative shrink-0 w-full">
      <div className="bg-white flex-[1_0_0] min-h-px min-w-px relative rounded-[16px]" data-name="ProjectCard">
        <div aria-hidden="true" className="absolute border border-[rgba(124,58,237,0.1)] border-solid inset-0 pointer-events-none rounded-[16px] shadow-[0px_1px_4px_0px_rgba(124,58,237,0.06),0px_1px_2px_0px_rgba(0,0,0,0.04)]" />
        <div className="content-stretch flex flex-col gap-[24px] items-start p-[20px] relative w-full">
          <Frame4 />
          <Container5 />
        </div>
      </div>
      <div className="bg-white flex-[1_0_0] min-h-px min-w-px relative rounded-[16px]" data-name="ProjectCard">
        <div aria-hidden="true" className="absolute border border-[rgba(124,58,237,0.1)] border-solid inset-0 pointer-events-none rounded-[16px] shadow-[0px_1px_4px_0px_rgba(124,58,237,0.06),0px_1px_2px_0px_rgba(0,0,0,0.04)]" />
        <div className="content-stretch flex flex-col gap-[24px] items-start p-[20px] relative w-full">
          <Frame6 />
          <Container7 />
        </div>
      </div>
      <div className="bg-white flex-[1_0_0] min-h-px min-w-px relative rounded-[16px]" data-name="ProjectCard">
        <div aria-hidden="true" className="absolute border border-[rgba(124,58,237,0.1)] border-solid inset-0 pointer-events-none rounded-[16px] shadow-[0px_1px_4px_0px_rgba(124,58,237,0.06),0px_1px_2px_0px_rgba(0,0,0,0.04)]" />
        <div className="content-stretch flex flex-col gap-[24px] items-start p-[20px] relative w-full">
          <Frame13 />
          <Container9 />
        </div>
      </div>
    </div>
  );
}

function Frame12() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full">
      <p className="font-['Bricolage_Grotesque:Bold',sans-serif] font-bold leading-[normal] relative shrink-0 text-[#0f0a1e] text-[14px] tracking-[-0.14px] w-full" style={{ fontVariationSettings: "'opsz' 14, 'wdth' 100" }}>
        Your projects
      </p>
      <Frame9 />
    </div>
  );
}

function Frame16() {
  return (
    <div className="relative shrink-0 w-full">
      <div className="content-stretch flex flex-col gap-[24px] items-start px-[24px] relative w-full">
        <Frame10 />
        <Frame12 />
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <div className="bg-[#f5f5f5] content-stretch flex flex-col items-start relative size-full" data-name="/dashboard">
      <div className="bg-white h-[58px] relative shrink-0 w-full" data-name="Button/Header">
        <div aria-hidden="true" className="absolute border-[rgba(124,58,237,0.1)] border-b border-solid inset-0 pointer-events-none shadow-[0px_1px_0px_0px_rgba(124,58,237,0.06)]" />
        <div className="flex flex-row items-center size-full">
          <div className="content-stretch flex items-center justify-between pb-px px-[24px] relative size-full">
            <Frame11 />
            <ShellLayout1 />
          </div>
        </div>
      </div>
      <div className="content-stretch flex gap-[12px] items-start p-[24px] relative shrink-0 w-[1440px]" data-name="Page-Header">
        <Frame2 />
        <Frame3 />
      </div>
      <Frame16 />
    </div>
  );
}