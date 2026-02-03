import { useState, useEffect } from 'react';
import { Save, RotateCcw, Loader2, LayoutDashboard, Image, FileText, Link2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { EditorSection } from '@/components/editor/EditorSection';
import { ArrayFieldEditor } from '@/components/editor/ArrayFieldEditor';
import { useToast } from '@/hooks/use-toast';
import { contentApi } from '@/lib/api';
import { ContentData, defaultContent } from '@/types/content';

export default function Editor() {
  const [content, setContent] = useState<ContentData>(defaultContent as ContentData);
  const [originalContent, setOriginalContent] = useState<ContentData>(defaultContent as ContentData);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    setIsLoading(true);
    const response = await contentApi.getContent();
    if (response.data?.data) {
      setContent(response.data.data);
      setOriginalContent(response.data.data);
    }
    setIsLoading(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    const response = await contentApi.updateContent(content);
    setIsSaving(false);

    if (response.error) {
      toast({
        variant: 'destructive',
        title: 'Save failed',
        description: response.error,
      });
    } else {
      setOriginalContent(content);
      toast({
        title: 'Content saved',
        description: 'Your changes have been saved successfully.',
      });
    }
  };

  const handleReset = () => {
    setContent(originalContent);
    toast({
      title: 'Changes discarded',
      description: 'All changes have been reset.',
    });
  };

  const hasChanges = JSON.stringify(content) !== JSON.stringify(originalContent);

  // Generic handler for array fields
  const updateArrayField = <T extends Record<string, unknown>>(
    section: keyof ContentData,
    field: string,
    items: T[]
  ) => {
    setContent((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: items,
      },
    }));
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Content Editor</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Edit your website content using the form below
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={handleReset}
              disabled={!hasChanges || isSaving}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button onClick={handleSave} disabled={!hasChanges || isSaving}>
              {isSaving ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Save Changes
            </Button>
          </div>
        </div>

        {/* Header Section */}
        <EditorSection
          title="Header"
          icon={<LayoutDashboard className="h-5 w-5" />}
        >
          <ArrayFieldEditor
            title="Logo"
            items={content.header.logo}
            fields={[
              { name: 'url', label: 'URL', type: 'url', placeholder: 'https://...' },
              { name: 'alt', label: 'Alt Text', type: 'text', placeholder: 'Logo description' },
            ]}
            onAdd={() =>
              updateArrayField('header', 'logo', [
                ...content.header.logo,
                { url: '', alt: '' },
              ])
            }
            onRemove={(index) =>
              updateArrayField(
                'header',
                'logo',
                content.header.logo.filter((_, i) => i !== index)
              )
            }
            onChange={(index, field, value) => {
              const updated = [...content.header.logo];
              updated[index] = { ...updated[index], [field]: value };
              updateArrayField('header', 'logo', updated);
            }}
            getDefaultItem={() => ({ url: '', alt: '' })}
          />

          <ArrayFieldEditor
            title="Navigation Items"
            items={content.header.navbar}
            fields={[
              { name: 'label', label: 'Label', type: 'text', placeholder: 'Home' },
              { name: 'href', label: 'Link', type: 'text', placeholder: '/' },
            ]}
            onAdd={() =>
              updateArrayField('header', 'navbar', [
                ...content.header.navbar,
                { label: '', href: '' },
              ])
            }
            onRemove={(index) =>
              updateArrayField(
                'header',
                'navbar',
                content.header.navbar.filter((_, i) => i !== index)
              )
            }
            onChange={(index, field, value) => {
              const updated = [...content.header.navbar];
              updated[index] = { ...updated[index], [field]: value };
              updateArrayField('header', 'navbar', updated);
            }}
            getDefaultItem={() => ({ label: '', href: '' })}
          />

          <ArrayFieldEditor
            title="Action Buttons"
            items={content.header.actionButton}
            fields={[
              { name: 'label', label: 'Label', type: 'text', placeholder: 'Get Started' },
              { name: 'href', label: 'Link', type: 'text', placeholder: '/signup' },
            ]}
            onAdd={() =>
              updateArrayField('header', 'actionButton', [
                ...content.header.actionButton,
                { label: '', href: '' },
              ])
            }
            onRemove={(index) =>
              updateArrayField(
                'header',
                'actionButton',
                content.header.actionButton.filter((_, i) => i !== index)
              )
            }
            onChange={(index, field, value) => {
              const updated = [...content.header.actionButton];
              updated[index] = { ...updated[index], [field]: value };
              updateArrayField('header', 'actionButton', updated);
            }}
            getDefaultItem={() => ({ label: '', href: '' })}
          />
        </EditorSection>

        {/* Banner Section */}
        <EditorSection
          title="Banner"
          icon={<Image className="h-5 w-5" />}
        >
          <ArrayFieldEditor
            title="Headlines"
            items={content.banner.headline}
            fields={[
              { name: 'text', label: 'Text', type: 'text', placeholder: 'Your headline here' },
            ]}
            onAdd={() =>
              updateArrayField('banner', 'headline', [
                ...content.banner.headline,
                { text: '' },
              ])
            }
            onRemove={(index) =>
              updateArrayField(
                'banner',
                'headline',
                content.banner.headline.filter((_, i) => i !== index)
              )
            }
            onChange={(index, field, value) => {
              const updated = [...content.banner.headline];
              updated[index] = { ...updated[index], [field]: value };
              updateArrayField('banner', 'headline', updated);
            }}
            getDefaultItem={() => ({ text: '' })}
          />

          <ArrayFieldEditor
            title="Subtext"
            items={content.banner.subtext}
            fields={[
              { name: 'text', label: 'Text', type: 'text', placeholder: 'Supporting text' },
            ]}
            onAdd={() =>
              updateArrayField('banner', 'subtext', [
                ...content.banner.subtext,
                { text: '' },
              ])
            }
            onRemove={(index) =>
              updateArrayField(
                'banner',
                'subtext',
                content.banner.subtext.filter((_, i) => i !== index)
              )
            }
            onChange={(index, field, value) => {
              const updated = [...content.banner.subtext];
              updated[index] = { ...updated[index], [field]: value };
              updateArrayField('banner', 'subtext', updated);
            }}
            getDefaultItem={() => ({ text: '' })}
          />

          <ArrayFieldEditor
            title="Hero Media"
            items={content.banner.heroMedia}
            fields={[
              { name: 'type', label: 'Type', type: 'text', placeholder: 'image' },
              { name: 'url', label: 'URL', type: 'url', placeholder: 'https://...' },
            ]}
            onAdd={() =>
              updateArrayField('banner', 'heroMedia', [
                ...content.banner.heroMedia,
                { type: 'image', url: '' },
              ])
            }
            onRemove={(index) =>
              updateArrayField(
                'banner',
                'heroMedia',
                content.banner.heroMedia.filter((_, i) => i !== index)
              )
            }
            onChange={(index, field, value) => {
              const updated = [...content.banner.heroMedia];
              updated[index] = { ...updated[index], [field]: value };
              updateArrayField('banner', 'heroMedia', updated);
            }}
            getDefaultItem={() => ({ type: 'image', url: '' })}
          />

          <ArrayFieldEditor
            title="Primary CTA"
            items={content.banner.primaryCTA}
            fields={[
              { name: 'label', label: 'Label', type: 'text', placeholder: 'Get Started' },
              { name: 'href', label: 'Link', type: 'text', placeholder: '/signup' },
            ]}
            onAdd={() =>
              updateArrayField('banner', 'primaryCTA', [
                ...content.banner.primaryCTA,
                { label: '', href: '' },
              ])
            }
            onRemove={(index) =>
              updateArrayField(
                'banner',
                'primaryCTA',
                content.banner.primaryCTA.filter((_, i) => i !== index)
              )
            }
            onChange={(index, field, value) => {
              const updated = [...content.banner.primaryCTA];
              updated[index] = { ...updated[index], [field]: value };
              updateArrayField('banner', 'primaryCTA', updated);
            }}
            getDefaultItem={() => ({ label: '', href: '' })}
          />

          <ArrayFieldEditor
            title="Secondary CTA"
            items={content.banner.secondaryCTA}
            fields={[
              { name: 'label', label: 'Label', type: 'text', placeholder: 'Learn More' },
              { name: 'href', label: 'Link', type: 'text', placeholder: '/about' },
            ]}
            onAdd={() =>
              updateArrayField('banner', 'secondaryCTA', [
                ...content.banner.secondaryCTA,
                { label: '', href: '' },
              ])
            }
            onRemove={(index) =>
              updateArrayField(
                'banner',
                'secondaryCTA',
                content.banner.secondaryCTA.filter((_, i) => i !== index)
              )
            }
            onChange={(index, field, value) => {
              const updated = [...content.banner.secondaryCTA];
              updated[index] = { ...updated[index], [field]: value };
              updateArrayField('banner', 'secondaryCTA', updated);
            }}
            getDefaultItem={() => ({ label: '', href: '' })}
          />
        </EditorSection>

        {/* Main Content Section */}
        <EditorSection
          title="Main Content"
          icon={<FileText className="h-5 w-5" />}
        >
          <ArrayFieldEditor
            title="Introduction"
            items={content.mainContent.introduction}
            fields={[
              { name: 'text', label: 'Text', type: 'text', placeholder: 'Introduction text' },
            ]}
            onAdd={() =>
              updateArrayField('mainContent', 'introduction', [
                ...content.mainContent.introduction,
                { text: '' },
              ])
            }
            onRemove={(index) =>
              updateArrayField(
                'mainContent',
                'introduction',
                content.mainContent.introduction.filter((_, i) => i !== index)
              )
            }
            onChange={(index, field, value) => {
              const updated = [...content.mainContent.introduction];
              updated[index] = { ...updated[index], [field]: value };
              updateArrayField('mainContent', 'introduction', updated);
            }}
            getDefaultItem={() => ({ text: '' })}
          />

          <ArrayFieldEditor
            title="Cards"
            items={content.mainContent.cards}
            fields={[
              { name: 'title', label: 'Title', type: 'text', placeholder: 'Card title' },
              { name: 'description', label: 'Description', type: 'text', placeholder: 'Card description' },
            ]}
            onAdd={() =>
              updateArrayField('mainContent', 'cards', [
                ...content.mainContent.cards,
                { title: '', description: '' },
              ])
            }
            onRemove={(index) =>
              updateArrayField(
                'mainContent',
                'cards',
                content.mainContent.cards.filter((_, i) => i !== index)
              )
            }
            onChange={(index, field, value) => {
              const updated = [...content.mainContent.cards];
              updated[index] = { ...updated[index], [field]: value };
              updateArrayField('mainContent', 'cards', updated);
            }}
            getDefaultItem={() => ({ title: '', description: '' })}
          />

          <ArrayFieldEditor
            title="Carousel Images"
            items={content.mainContent.carousel}
            fields={[
              { name: 'image', label: 'Image URL', type: 'url', placeholder: 'https://...' },
            ]}
            onAdd={() =>
              updateArrayField('mainContent', 'carousel', [
                ...content.mainContent.carousel,
                { image: '' },
              ])
            }
            onRemove={(index) =>
              updateArrayField(
                'mainContent',
                'carousel',
                content.mainContent.carousel.filter((_, i) => i !== index)
              )
            }
            onChange={(index, field, value) => {
              const updated = [...content.mainContent.carousel];
              updated[index] = { ...updated[index], [field]: value };
              updateArrayField('mainContent', 'carousel', updated);
            }}
            getDefaultItem={() => ({ image: '' })}
          />

          <ArrayFieldEditor
            title="Highlights"
            items={content.mainContent.highlights}
            fields={[
              { name: 'text', label: 'Text', type: 'text', placeholder: 'Highlight text' },
            ]}
            onAdd={() =>
              updateArrayField('mainContent', 'highlights', [
                ...content.mainContent.highlights,
                { text: '' },
              ])
            }
            onRemove={(index) =>
              updateArrayField(
                'mainContent',
                'highlights',
                content.mainContent.highlights.filter((_, i) => i !== index)
              )
            }
            onChange={(index, field, value) => {
              const updated = [...content.mainContent.highlights];
              updated[index] = { ...updated[index], [field]: value };
              updateArrayField('mainContent', 'highlights', updated);
            }}
            getDefaultItem={() => ({ text: '' })}
          />
        </EditorSection>

        {/* Footer Section */}
        <EditorSection
          title="Footer"
          icon={<Link2 className="h-5 w-5" />}
        >
          <ArrayFieldEditor
            title="Links"
            items={content.footer.links}
            fields={[
              { name: 'label', label: 'Label', type: 'text', placeholder: 'Privacy Policy' },
              { name: 'href', label: 'Link', type: 'text', placeholder: '/privacy' },
            ]}
            onAdd={() =>
              updateArrayField('footer', 'links', [
                ...content.footer.links,
                { label: '', href: '' },
              ])
            }
            onRemove={(index) =>
              updateArrayField(
                'footer',
                'links',
                content.footer.links.filter((_, i) => i !== index)
              )
            }
            onChange={(index, field, value) => {
              const updated = [...content.footer.links];
              updated[index] = { ...updated[index], [field]: value };
              updateArrayField('footer', 'links', updated);
            }}
            getDefaultItem={() => ({ label: '', href: '' })}
          />

          <ArrayFieldEditor
            title="Social Icons"
            items={content.footer.socialIcons}
            fields={[
              { name: 'platform', label: 'Platform', type: 'text', placeholder: 'twitter' },
              { name: 'url', label: 'URL', type: 'url', placeholder: 'https://twitter.com/...' },
            ]}
            onAdd={() =>
              updateArrayField('footer', 'socialIcons', [
                ...content.footer.socialIcons,
                { platform: '', url: '' },
              ])
            }
            onRemove={(index) =>
              updateArrayField(
                'footer',
                'socialIcons',
                content.footer.socialIcons.filter((_, i) => i !== index)
              )
            }
            onChange={(index, field, value) => {
              const updated = [...content.footer.socialIcons];
              updated[index] = { ...updated[index], [field]: value };
              updateArrayField('footer', 'socialIcons', updated);
            }}
            getDefaultItem={() => ({ platform: '', url: '' })}
          />

          <ArrayFieldEditor
            title="Contact Info"
            items={content.footer.contactInfo as Array<{ email: string; phone: string; address: string }>}
            fields={[
              { name: 'email', label: 'Email', type: 'email', placeholder: 'support@company.com' },
              { name: 'phone', label: 'Phone', type: 'text', placeholder: '+1 234 567 890' },
              { name: 'address', label: 'Address', type: 'text', placeholder: '123 Main St' },
            ]}
            onAdd={() =>
              updateArrayField('footer', 'contactInfo', [
                ...content.footer.contactInfo,
                { email: '', phone: '', address: '' },
              ])
            }
            onRemove={(index) =>
              updateArrayField(
                'footer',
                'contactInfo',
                content.footer.contactInfo.filter((_, i) => i !== index)
              )
            }
            onChange={(index, field, value) => {
              const updated = [...content.footer.contactInfo];
              updated[index] = { ...updated[index], [field]: value };
              updateArrayField('footer', 'contactInfo', updated);
            }}
            getDefaultItem={() => ({ email: '', phone: '', address: '' })}
          />

          <ArrayFieldEditor
            title="Copyright"
            items={content.footer.copyrights}
            fields={[
              { name: 'text', label: 'Text', type: 'text', placeholder: '© 2026 Company Inc.' },
            ]}
            onAdd={() =>
              updateArrayField('footer', 'copyrights', [
                ...content.footer.copyrights,
                { text: '' },
              ])
            }
            onRemove={(index) =>
              updateArrayField(
                'footer',
                'copyrights',
                content.footer.copyrights.filter((_, i) => i !== index)
              )
            }
            onChange={(index, field, value) => {
              const updated = [...content.footer.copyrights];
              updated[index] = { ...updated[index], [field]: value };
              updateArrayField('footer', 'copyrights', updated);
            }}
            getDefaultItem={() => ({ text: '' })}
          />
        </EditorSection>
      </div>
    </DashboardLayout>
  );
}
