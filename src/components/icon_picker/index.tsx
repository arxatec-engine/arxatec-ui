import * as React from "react";
import { useState, useMemo, useCallback, useEffect } from "react";
import { cn } from "@/utilities/index";
import { type LucideProps, type LucideIcon, Search } from "lucide-react";
import {
  DynamicIcon,
  dynamicIconImports,
  type IconName,
} from "lucide-react/dynamic";
import { Button } from "@/components/button";
import { Skeleton } from "@/components/skeleton";
import { ScrollArea } from "@/components/scroll_area";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/popover";
import { Input } from "@/components/input";

import { iconsData } from "./icons_data";
import { useVirtualizer, type VirtualItem } from "@tanstack/react-virtual";
import Fuse from "fuse.js";
import { useDebounceValue } from "usehooks-ts";

export type IconData = (typeof iconsData)[number];

const ICONS_PER_ROW = 8;

interface IconPickerProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof PopoverTrigger>,
    "onSelect" | "onOpenChange"
  > {
  value?: IconName;
  defaultValue?: IconName;
  onValueChange?: (value: IconName) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  searchable?: boolean;
  searchPlaceholder?: string;
  triggerPlaceholder?: string;
  iconsList?: IconData[];
  categorized?: boolean;
  modal?: boolean;
}

const IconRenderer = React.memo(({ name }: { name: IconName }) => {
  return <Icon name={name} className="size-full" />;
});
IconRenderer.displayName = "IconRenderer";

const IconsColumnSkeleton = () => {
  return (
    <div className="flex flex-col gap-2 w-full px-2">
      <Skeleton className="h-4 w-1/2 rounded-md" />
      <div
        className="grid gap-2 w-full"
        style={{
          gridTemplateColumns: `repeat(${ICONS_PER_ROW}, minmax(0, 1fr))`,
        }}
      >
        {Array.from({ length: 40 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-8 rounded-md" />
        ))}
      </div>
    </div>
  );
};

const useIconsData = () => {
  const [icons, setIcons] = useState<IconData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadIcons = async () => {
      setIsLoading(true);

      const { iconsData } = await import("./icons_data");
      if (isMounted) {
        setIcons(
          iconsData.filter((icon: IconData) => {
            return icon.name in dynamicIconImports;
          })
        );
        setIsLoading(false);
      }
    };

    loadIcons();

    return () => {
      isMounted = false;
    };
  }, []);

  return { icons, isLoading };
};

const IconPicker = React.forwardRef<
  React.ComponentRef<typeof PopoverTrigger>,
  IconPickerProps
>(
  (
    {
      value,
      defaultValue,
      onValueChange,
      open,
      defaultOpen,
      onOpenChange,
      children,
      searchable = true,
      searchPlaceholder = "Buscar icono...",
      triggerPlaceholder = "Seleccionar icono",
      iconsList,
      categorized = true,
      modal = false,
      ...props
    },
    ref
  ) => {
    const [selectedIcon, setSelectedIcon] = useState<IconName | undefined>(
      defaultValue
    );
    const [isOpen, setIsOpen] = useState(defaultOpen || false);
    const [search, setSearch] = useDebounceValue("", 100);
    const [isPopoverVisible, setIsPopoverVisible] = useState(false);
    const { icons } = useIconsData();
    const [isLoading, setIsLoading] = useState(true);

    const iconsToUse = useMemo(() => iconsList || icons, [iconsList, icons]);

    const fuseInstance = useMemo(() => {
      return new Fuse(iconsToUse, {
        keys: ["name", "tags", "categories"],
        threshold: 0.3,
        ignoreLocation: true,
        includeScore: true,
      });
    }, [iconsToUse]);

    const filteredIcons = useMemo(() => {
      if (search.trim() === "") {
        return iconsToUse;
      }

      const results = fuseInstance.search(search.toLowerCase().trim());
      return results.map((result) => result.item);
    }, [search, iconsToUse, fuseInstance]);

    const categorizedIcons = useMemo(() => {
      if (!categorized || search.trim() !== "") {
        return [{ name: "Todos", icons: filteredIcons }];
      }

      const categories = new Map<string, IconData[]>();

      filteredIcons.forEach((icon) => {
        if (icon.categories && icon.categories.length > 0) {
          icon.categories.forEach((category) => {
            if (!categories.has(category)) {
              categories.set(category, []);
            }
            categories.get(category)!.push(icon);
          });
        } else {
          const category = "Otros";
          if (!categories.has(category)) {
            categories.set(category, []);
          }
          categories.get(category)!.push(icon);
        }
      });

      return Array.from(categories.entries())
        .map(([name, icons]) => ({ name, icons }))
        .sort((a, b) => a.name.localeCompare(b.name));
    }, [filteredIcons, categorized, search]);

    const virtualItems = useMemo(() => {
      const items: Array<{
        type: "category" | "row";
        categoryIndex: number;
        rowIndex?: number;
        icons?: IconData[];
      }> = [];

      categorizedIcons.forEach((category, categoryIndex) => {
        items.push({ type: "category", categoryIndex });

        const rows = [];
        for (let i = 0; i < category.icons.length; i += ICONS_PER_ROW) {
          rows.push(category.icons.slice(i, i + ICONS_PER_ROW));
        }

        rows.forEach((rowIcons, rowIndex) => {
          items.push({
            type: "row",
            categoryIndex,
            rowIndex,
            icons: rowIcons,
          });
        });
      });

      return items;
    }, [categorizedIcons]);

    const categoryIndices = useMemo(() => {
      const indices: Record<string, number> = {};

      virtualItems.forEach((item, index) => {
        if (item.type === "category") {
          indices[categorizedIcons[item.categoryIndex].name] = index;
        }
      });

      return indices;
    }, [virtualItems, categorizedIcons]);

    const parentRef = React.useRef<HTMLDivElement>(null);

    const virtualizer = useVirtualizer({
      count: virtualItems.length,
      getScrollElement: () => parentRef.current,
      estimateSize: (index) =>
        virtualItems[index].type === "category" ? 25 : 25,
      paddingEnd: 0,
      gap: 0,
      overscan: 0,
    });

    const handleValueChange = useCallback(
      (icon: IconName) => {
        if (value === undefined) {
          setSelectedIcon(icon);
        }
        onValueChange?.(icon);
      },
      [value, onValueChange]
    );

    const handleOpenChange = useCallback(
      (newOpen: boolean) => {
        setSearch("");
        if (open === undefined) {
          setIsOpen(newOpen);
        }
        onOpenChange?.(newOpen);

        setIsPopoverVisible(newOpen);

        if (newOpen) {
          setTimeout(() => {
            virtualizer.measure();
            setIsLoading(false);
          }, 1);
        }
      },
      [open, onOpenChange, virtualizer]
    );

    const handleIconClick = useCallback(
      (iconName: IconName) => {
        handleValueChange(iconName);
        setIsOpen(false);
        setSearch("");
      },
      [handleValueChange]
    );

    const handleSearchChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);

        if (parentRef.current) {
          parentRef.current.scrollTop = 0;
        }

        virtualizer.scrollToOffset(0);
      },
      [virtualizer]
    );

    const scrollToCategory = useCallback(
      (categoryName: string) => {
        const categoryIndex = categoryIndices[categoryName];

        if (categoryIndex !== undefined && virtualizer) {
          virtualizer.scrollToIndex(categoryIndex, {
            align: "start",
            behavior: "smooth",
          });
        }
      },
      [categoryIndices, virtualizer]
    );

    const categoryButtons = useMemo(() => {
      if (!categorized || search.trim() !== "") return null;

      return categorizedIcons.map((category) => (
        <Button
          key={category.name}
          variant={"outline"}
          size="sm"
          className="text-xs"
          onClick={(e) => {
            e.stopPropagation();
            scrollToCategory(category.name);
          }}
        >
          {category.name.charAt(0).toUpperCase() + category.name.slice(1)}
        </Button>
      ));
    }, [categorizedIcons, scrollToCategory, categorized, search]);

    const renderIcon = useCallback(
      (icon: IconData) => (
        <button
          key={icon.name}
          type="button"
          className={cn(
            "size-7 p-1.5 rounded-md transition-all duration-200",
            "flex items-center justify-center",
            "hover:bg-accent/50",
            "active:scale-90",
            (value || selectedIcon) === icon.name
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-foreground hover:shadow-md"
          )}
          onClick={() => handleIconClick(icon.name as IconName)}
          title={icon.name}
        >
          <IconRenderer name={icon.name as IconName} />
        </button>
      ),
      [handleIconClick, value, selectedIcon]
    );

    const renderVirtualContent = useCallback(() => {
      if (filteredIcons.length === 0) {
        return (
          <div className="text-center py-10 text-muted-foreground text-sm">
            No se encontraron iconos
          </div>
        );
      }

      return (
        <div
          className="relative w-full overscroll-contain"
          style={{
            height: `${virtualizer.getTotalSize()}px`,
          }}
        >
          {virtualizer.getVirtualItems().map((virtualItem: VirtualItem) => {
            const item = virtualItems[virtualItem.index];

            if (!item) return null;

            const itemStyle = {
              position: "absolute" as const,
              top: 0,
              left: 0,
              width: "100%",
              height: `${virtualItem.size}px`,
              transform: `translateY(${virtualItem.start}px)`,
            };

            if (item.type === "category") {
              return (
                <div
                  style={itemStyle}
                  key={virtualItem.key}
                  className="flex items-center px-2 pt-2 pb-0.5 z-10"
                >
                  <h3 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    {categorizedIcons[item.categoryIndex].name}
                  </h3>
                </div>
              );
            }

            return (
              <div
                style={itemStyle}
                key={virtualItem.key}
                data-index={virtualItem.index}
                className="flex items-center justify-center px-1"
              >
                <div
                  className="grid w-full gap-0"
                  style={{
                    gridTemplateColumns: `repeat(${ICONS_PER_ROW}, minmax(0, 1fr))`,
                  }}
                >
                  {item.icons!.map(renderIcon)}
                </div>
              </div>
            );
          })}
        </div>
      );
    }, [
      virtualizer,
      virtualItems,
      categorizedIcons,
      filteredIcons,
      renderIcon,
    ]);

    React.useEffect(() => {
      if (isPopoverVisible) {
        setIsLoading(true);
        const timer = setTimeout(() => {
          setIsLoading(false);
          virtualizer.measure();
        }, 10);

        const resizeObserver = new ResizeObserver(() => {
          virtualizer.measure();
        });

        if (parentRef.current) {
          resizeObserver.observe(parentRef.current);
        }

        return () => {
          clearTimeout(timer);
          resizeObserver.disconnect();
        };
      }
    }, [isPopoverVisible, virtualizer]);

    return (
      <Popover
        open={open ?? isOpen}
        onOpenChange={handleOpenChange}
        modal={modal}
      >
        <PopoverTrigger ref={ref} asChild {...props}>
          {children || (
            <Button variant="outline" size="sm" className="gap-2 px-3">
              {value || selectedIcon ? (
                <>
                  <Icon name={(value || selectedIcon)!} className="size-4" />
                  <span className="truncate max-w-[100px]">
                    {value || selectedIcon}
                  </span>
                </>
              ) : (
                triggerPlaceholder
              )}
            </Button>
          )}
        </PopoverTrigger>
        <PopoverContent
          className="w-[275px] p-0 shadow-2xl border-muted-foreground/10 "
          align="start"
        >
          {searchable && (
            <div className="p-2 border-b bg-muted/30">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 size-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <Input
                  placeholder={searchPlaceholder}
                  onChange={handleSearchChange}
                  size="sm"
                  className="h-7 pl-8 bg-background focus-visible:ring-primary/20"
                />
              </div>
            </div>
          )}

          <div className="flex flex-col">
            {categorized && search.trim() === "" && (
              <div className="flex flex-row gap-1.5 p-2 overflow-x-auto border-b bg-muted/10 no-scrollbar">
                {categoryButtons}
              </div>
            )}

            <ScrollArea
              className="h-[250px]"
              viewportRef={parentRef}
              onWheel={(e) => e.stopPropagation()}
            >
              <div className="py-2">
                {isLoading ? <IconsColumnSkeleton /> : renderVirtualContent()}
              </div>
            </ScrollArea>
          </div>
        </PopoverContent>
      </Popover>
    );
  }
);
IconPicker.displayName = "IconPicker";

interface IconProps extends Omit<LucideProps, "ref"> {
  name: IconName;
}

const Icon = React.forwardRef<React.ComponentRef<LucideIcon>, IconProps>(
  ({ name, ...props }, ref) => {
    return (
      <DynamicIcon
        name={name}
        strokeWidth={2}
        {...props}
        ref={ref}
        className={cn(props.className)}
      />
    );
  }
);
Icon.displayName = "Icon";

export { IconPicker, Icon, type IconName };
