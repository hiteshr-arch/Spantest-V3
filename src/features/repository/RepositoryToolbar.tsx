import React from "react";
import { Input, Select } from "antd";
import {
  SearchOutlined,
  RightOutlined,
  FolderOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import type { RepoFolder } from "../../lib/mock-data";

interface RepositoryToolbarProps {
  folders: RepoFolder[];
  selectedFolderId: string | null;
  breadcrumb: { id: string; name: string }[];
  search: string;
  filterType: string | null;
  filterTestType: string | null;
  filterPriority: string | null;
  filterCategory: string | null;
  selectedRowIds: Set<string>;
  filteredCount: number;
  onSelectFolder: (id: string | null) => void;
  onSearchChange: (value: string) => void;
  onFilterTypeChange: (value: string | null) => void;
  onFilterTestTypeChange: (value: string | null) => void;
  onFilterPriorityChange: (value: string | null) => void;
  onFilterCategoryChange: (value: string | null) => void;
  onClearFilters: () => void;
  onBulkMove: () => void;
  onBulkDelete: () => void;
}

export function RepositoryToolbar({
  folders,
  selectedFolderId,
  breadcrumb,
  search,
  filterType,
  filterTestType,
  filterPriority,
  filterCategory,
  selectedRowIds,
  filteredCount,
  onSelectFolder,
  onSearchChange,
  onFilterTypeChange,
  onFilterTestTypeChange,
  onFilterPriorityChange,
  onFilterCategoryChange,
  onClearFilters,
  onBulkMove,
  onBulkDelete,
}: RepositoryToolbarProps) {
  const activeFilterCount = [
    filterType,
    filterTestType,
    filterPriority,
    filterCategory,
  ].filter(Boolean).length;

  return (
    <>
      {/* toolbar row */}
      <div className="repository__toolbar flex items-center gap-3 px-6 py-3 border-b border-[#f3f0fb] bg-white">
        {/* breadcrumb */}
        <div className="flex items-center gap-1 flex-1 min-w-0">
          <span
            onClick={() => onSelectFolder(null)}
            className="!text-[#8b87a0] text-[12px] cursor-pointer hover:!text-[#7c3aed] transition-colors shrink-0 font-medium"
          >
            Repository
          </span>
          {breadcrumb.map((b) => (
            <React.Fragment key={b.id}>
              <RightOutlined className="!text-[#d9d5e8] text-[8px] shrink-0" />
              <span
                onClick={() => onSelectFolder(b.id)}
                className={`text-[12px] cursor-pointer transition-colors truncate ${
                  b.id === selectedFolderId
                    ? "!text-[#7c3aed] font-semibold"
                    : "!text-[#8b87a0] hover:!text-[#7c3aed] font-medium"
                }`}
              >
                {b.name}
              </span>
            </React.Fragment>
          ))}
        </div>

        {/* search */}
        <Input
          prefix={<SearchOutlined className="!text-[#b0adbe]" />}
          placeholder="Search items..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          allowClear
          className="repository__search"
          style={{
            width: 200,
            height: 34,
            fontSize: 12,
          }}
        />

        {/* filters */}
        <Select
          placeholder="Type"
          value={filterType}
          onChange={onFilterTypeChange}
          allowClear
          style={{ width: 110, fontSize: 12, height: 34 }}
          options={[
            { label: "Scenario", value: "scenario" },
            { label: "Test Case", value: "testcase" },
            { label: "Script", value: "script" },
          ]}
        />
        <Select
          placeholder="Test Type"
          value={filterTestType}
          onChange={onFilterTestTypeChange}
          allowClear
          style={{ width: 100, fontSize: 12, height: 34 }}
          options={[
            { label: "UI", value: "ui" },
            { label: "API", value: "api" },
          ]}
        />
        <Select
          placeholder="Priority"
          value={filterPriority}
          onChange={onFilterPriorityChange}
          allowClear
          style={{ width: 100, fontSize: 12, height: 34 }}
          options={[
            { label: "High", value: "High" },
            { label: "Medium", value: "Medium" },
            { label: "Low", value: "Low" },
          ]}
        />
        <Select
          placeholder="Category"
          value={filterCategory}
          onChange={onFilterCategoryChange}
          allowClear
          style={{ width: 110, fontSize: 12, height: 34 }}
          options={[
            { label: "Positive", value: "Positive" },
            { label: "Negative", value: "Negative" },
            { label: "Edge Case", value: "Edge Case" },
          ]}
        />

        {activeFilterCount > 0 && (
          <button
            onClick={onClearFilters}
            className="!text-[#7c3aed] text-[11px] bg-transparent border-0 cursor-pointer hover:underline shrink-0 font-semibold"
          >
            Clear ({activeFilterCount})
          </button>
        )}
      </div>

      {/* summary bar */}
      <div className="flex items-center gap-4 px-6 py-2 bg-[#faf9ff]">
        <span className="!text-[#8b87a0] text-[11.5px]">
          Showing{" "}
          <span className="!text-[#0f0a1e] font-semibold">
            {filteredCount}
          </span>{" "}
          item{filteredCount !== 1 ? "s" : ""}
          {selectedFolderId && (
            <>
              {" "}
              in{" "}
              <span className="!text-[#7c3aed] font-semibold">
                {folders.find((f) => f.id === selectedFolderId)?.name}
              </span>
            </>
          )}
        </span>

        {/* bulk actions */}
        {selectedRowIds.size > 0 && (
          <div className="flex items-center gap-[6px] ml-auto">
            <span className="!text-[#7c3aed] text-[11px] mr-1 font-semibold">
              {selectedRowIds.size} selected
            </span>
            <button
              onClick={onBulkMove}
              className="flex items-center gap-[5px] px-[10px] py-[5px] rounded-md border border-[#e2dff0] bg-white text-[11px] !text-[#4c4568] hover:!text-[#7c3aed] hover:border-[#7c3aed] cursor-pointer transition-colors font-medium"
            >
              <FolderOutlined className="text-[11px]" />
              Move to Folder
            </button>
            <button
              onClick={onBulkDelete}
              className="flex items-center gap-[5px] px-[10px] py-[5px] rounded-md border border-[#e2dff0] bg-white text-[11px] !text-[#4c4568] hover:!text-[#d4183d] hover:border-[#d4183d] cursor-pointer transition-colors font-medium"
            >
              <DeleteOutlined className="text-[11px]" />
              Delete
            </button>
          </div>
        )}
      </div>
    </>
  );
}
