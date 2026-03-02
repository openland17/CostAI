"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { Project, LineItem } from "./types";
import { mockProjects, mockLineItems } from "./mockData";
import { generateId } from "./utils";

interface ProjectContextType {
  projects: Project[];
  lineItems: LineItem[];
  addLineItems: (items: Omit<LineItem, "id">[]) => void;
  addLineItem: (item: Omit<LineItem, "id">) => void;
  updateLineItem: (id: string, updates: Partial<LineItem>) => void;
  deleteLineItem: (id: string) => void;
  getProjectLineItems: (projectId: string) => LineItem[];
}

const ProjectContext = createContext<ProjectContextType | null>(null);

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const [projects] = useState<Project[]>(mockProjects);
  const [lineItems, setLineItems] = useState<LineItem[]>(mockLineItems);

  const addLineItems = useCallback((items: Omit<LineItem, "id">[]) => {
    const newItems = items.map((item) => ({
      ...item,
      id: generateId(),
    }));
    setLineItems((prev) => [...prev, ...newItems]);
  }, []);

  const addLineItem = useCallback((item: Omit<LineItem, "id">) => {
    setLineItems((prev) => [...prev, { ...item, id: generateId() }]);
  }, []);

  const updateLineItem = useCallback(
    (id: string, updates: Partial<LineItem>) => {
      setLineItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
      );
    },
    []
  );

  const deleteLineItem = useCallback((id: string) => {
    setLineItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const getProjectLineItems = useCallback(
    (projectId: string) => lineItems.filter((li) => li.projectId === projectId),
    [lineItems]
  );

  return (
    <ProjectContext.Provider
      value={{
        projects,
        lineItems,
        addLineItems,
        addLineItem,
        updateLineItem,
        deleteLineItem,
        getProjectLineItems,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error("useProject must be used within a ProjectProvider");
  }
  return context;
}
