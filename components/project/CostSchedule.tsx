"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { COST_CATEGORIES, LineItem } from "@/lib/types";
import CategoryTab from "./CategoryTab";

interface CostScheduleProps {
  items: LineItem[];
  projectId: string;
}

export default function CostSchedule({ items, projectId }: CostScheduleProps) {
  const firstCategoryWithItems =
    COST_CATEGORIES.find((cat) =>
      items.some((i) => i.category === cat)
    ) || COST_CATEGORIES[0];

  return (
    <Tabs
      defaultValue={firstCategoryWithItems}
      className="space-y-4"
    >
      <ScrollArea className="w-full">
        <TabsList className="inline-flex h-auto w-max gap-1 bg-transparent p-0">
          {COST_CATEGORIES.map((category) => {
            const count = items.filter((i) => i.category === category).length;
            return (
              <TabsTrigger
                key={category}
                value={category}
                className="gap-1.5 rounded-lg border border-transparent px-3 py-2 text-xs font-medium data-[state=active]:border-primary/30 data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
              >
                {category}
                {count > 0 && (
                  <Badge
                    variant="secondary"
                    className="ml-1 h-4 min-w-[16px] px-1 text-[10px]"
                  >
                    {count}
                  </Badge>
                )}
              </TabsTrigger>
            );
          })}
        </TabsList>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      {COST_CATEGORIES.map((category) => (
        <TabsContent key={category} value={category}>
          <CategoryTab
            category={category}
            items={items}
            projectId={projectId}
          />
        </TabsContent>
      ))}
    </Tabs>
  );
}
