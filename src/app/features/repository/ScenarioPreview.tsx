import { Tag } from "antd";
import type { Scenario } from "../../lib/mock-data";

export function ScenarioPreview({ scenario }: { scenario: Scenario }) {
  const isApi = scenario.type === "api";
  const steps = isApi ? scenario.apiSteps : scenario.steps;

  if (!steps.length) {
    return (
      <p
        className="!text-[#8b87a0] text-[12px] italic py-2"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        Scenario only — no test case steps attached.
      </p>
    );
  }

  if (isApi) {
    return (
      <div className="overflow-x-auto">
        <table
          className="repo__preview-table w-full text-[11px] border-collapse"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          <thead>
            <tr>
              {[
                "#",
                "Method",
                "Endpoint",
                "Status",
                "Payload",
                "Expected Response",
              ].map((h) => (
                <th
                  key={h}
                  className="text-left px-2 py-[6px] !text-[#8b87a0] bg-[#faf9ff] border-b border-[#f3f0fb] whitespace-nowrap"
                  style={{ fontWeight: 600 }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {scenario.apiSteps.map((s, i) => (
              <tr key={s.id} className="hover:bg-[#faf5ff] transition-colors">
                <td className="px-2 py-[5px] border-b border-[#f3f0fb] !text-[#b0adbe]">
                  {i + 1}
                </td>
                <td className="px-2 py-[5px] border-b border-[#f3f0fb]">
                  <Tag
                    className="!text-[10px] !px-[6px] !py-0 !m-0 !leading-[18px]"
                    color={
                      s.method === "GET"
                        ? "blue"
                        : s.method === "POST"
                          ? "green"
                          : s.method === "DELETE"
                            ? "red"
                            : "orange"
                    }
                  >
                    {s.method}
                  </Tag>
                </td>
                <td className="px-2 py-[5px] border-b border-[#f3f0fb] !text-[#4c4568] font-mono text-[10px]">
                  {s.endpoint}
                </td>
                <td className="px-2 py-[5px] border-b border-[#f3f0fb] !text-[#4c4568]">
                  {s.outputStatusCode}
                </td>
                <td className="px-2 py-[5px] border-b border-[#f3f0fb] !text-[#4c4568] max-w-[180px] truncate font-mono text-[10px]">
                  {s.payload}
                </td>
                <td className="px-2 py-[5px] border-b border-[#f3f0fb] !text-[#4c4568] max-w-[180px] truncate font-mono text-[10px]">
                  {s.expectedResponse}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <table
      className="repo__preview-table w-full text-[11px] border-collapse"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <thead>
        <tr>
          {["#", "Precondition", "Step", "Test Data", "Expected Result"].map(
            (h) => (
              <th
                key={h}
                className="text-left px-2 py-[6px] !text-[#8b87a0] bg-[#faf9ff] border-b border-[#f3f0fb] whitespace-nowrap"
                style={{ fontWeight: 600 }}
              >
                {h}
              </th>
            ),
          )}
        </tr>
      </thead>
      <tbody>
        {scenario.steps.map((s, i) => (
          <tr key={s.id} className="hover:bg-[#faf5ff] transition-colors">
            <td className="px-2 py-[5px] border-b border-[#f3f0fb] !text-[#b0adbe]">
              {i + 1}
            </td>
            <td className="px-2 py-[5px] border-b border-[#f3f0fb] !text-[#4c4568]">
              {s.precondition}
            </td>
            <td className="px-2 py-[5px] border-b border-[#f3f0fb] !text-[#4c4568]">
              {s.step}
            </td>
            <td className="px-2 py-[5px] border-b border-[#f3f0fb] !text-[#4c4568]">
              {s.testData}
            </td>
            <td className="px-2 py-[5px] border-b border-[#f3f0fb] !text-[#4c4568]">
              {s.expectedResult}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
