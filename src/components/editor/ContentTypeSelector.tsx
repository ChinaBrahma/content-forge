import { useState, useEffect } from 'react';
import { Loader2, ChevronDown, FileJson } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { contentApi, ContentType, ContentItem } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { ContentData } from '@/types/content';

interface ContentTypeSelectorProps {
  onContentLoad: (content: ContentData, contentTypeId: string, contentId: string) => void;
}

export function ContentTypeSelector({ onContentLoad }: ContentTypeSelectorProps) {
  const [contentTypes, setContentTypes] = useState<ContentType[]>([]);
  const [contents, setContents] = useState<ContentItem[]>([]);
  const [selectedType, setSelectedType] = useState<ContentType | null>(null);
  const [isLoadingTypes, setIsLoadingTypes] = useState(false);
  const [isLoadingContents, setIsLoadingContents] = useState(false);
  const { toast } = useToast();

  // Fetch content types when dropdown opens
  const handleFetchContentTypes = async () => {
    if (contentTypes.length > 0) return; // Already fetched
    
    setIsLoadingTypes(true);
    const response = await contentApi.getContentTypes();
    setIsLoadingTypes(false);

    if (response.error) {
      toast({
        variant: 'destructive',
        title: 'Failed to load content types',
        description: response.error,
      });
      return;
    }

    if (response.data?.data) {
      setContentTypes(response.data.data);
    }
  };

  // Fetch contents for selected content type
  const handleSelectContentType = async (contentType: ContentType) => {
    setSelectedType(contentType);
    setIsLoadingContents(true);
    
    const response = await contentApi.getContents(contentType._id);
    setIsLoadingContents(false);

    if (response.error) {
      toast({
        variant: 'destructive',
        title: 'Failed to load contents',
        description: response.error,
      });
      return;
    }

    if (response.data?.data) {
      setContents(response.data.data);
    }
  };

  // Load selected content into editor
  const handleSelectContent = (contentItem: ContentItem) => {
    if (selectedType) {
      onContentLoad(contentItem.data, selectedType._id, contentItem._id);
      toast({
        title: 'Content loaded',
        description: `Loaded content from "${selectedType.name}"`,
      });
    }
  };

  // Reset to content type selection
  const handleBackToTypes = () => {
    setSelectedType(null);
    setContents([]);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" onClick={handleFetchContentTypes}>
          <FileJson className="h-4 w-4 mr-2" />
          Load Content
          <ChevronDown className="h-4 w-4 ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 bg-popover z-50">
        {isLoadingTypes ? (
          <div className="flex items-center justify-center p-4">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="ml-2 text-sm">Loading content types...</span>
          </div>
        ) : selectedType ? (
          <>
            <DropdownMenuLabel className="flex items-center justify-between">
              <span>{selectedType.name}</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs"
                onClick={(e) => {
                  e.preventDefault();
                  handleBackToTypes();
                }}
              >
                Back
              </Button>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {isLoadingContents ? (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="ml-2 text-sm">Loading contents...</span>
              </div>
            ) : contents.length === 0 ? (
              <div className="p-4 text-sm text-muted-foreground text-center">
                No content available
              </div>
            ) : (
              contents.map((content, index) => (
                <DropdownMenuItem
                  key={content._id}
                  onClick={() => handleSelectContent(content)}
                  className="cursor-pointer"
                >
                  <FileJson className="h-4 w-4 mr-2" />
                  Content #{index + 1}
                  <span className="ml-auto text-xs text-muted-foreground">
                    {new Date(content.createdAt).toLocaleDateString()}
                  </span>
                </DropdownMenuItem>
              ))
            )}
          </>
        ) : contentTypes.length === 0 ? (
          <div className="p-4 text-sm text-muted-foreground text-center">
            No content types available
          </div>
        ) : (
          <>
            <DropdownMenuLabel>Select Content Type</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {contentTypes.map((type) => (
              <DropdownMenuItem
                key={type._id}
                onClick={() => handleSelectContentType(type)}
                className="cursor-pointer"
              >
                <FileJson className="h-4 w-4 mr-2" />
                {type.name}
                <span className="ml-auto text-xs text-muted-foreground">
                  {type.contentsId.length} items
                </span>
              </DropdownMenuItem>
            ))}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
