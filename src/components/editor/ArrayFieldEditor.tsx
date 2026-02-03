import { Plus, Trash2, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';

interface FieldConfig {
  name: string;
  label: string;
  type: 'text' | 'url' | 'email' | 'textarea';
  placeholder?: string;
}

interface ArrayFieldEditorProps<T extends Record<string, string>> {
  title: string;
  items: T[];
  fields: FieldConfig[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onChange: (index: number, field: keyof T, value: string) => void;
  getDefaultItem: () => T;
}

export function ArrayFieldEditor<T extends Record<string, string>>({
  title,
  items,
  fields,
  onAdd,
  onRemove,
  onChange,
}: ArrayFieldEditorProps<T>) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium text-muted-foreground">{title}</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onAdd}
          className="h-8 gap-1"
        >
          <Plus className="h-3 w-3" />
          Add
        </Button>
      </div>
      
      {items.length === 0 ? (
        <div className="text-center py-6 border border-dashed border-border rounded-lg">
          <p className="text-sm text-muted-foreground">No items yet. Click "Add" to create one.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((item, index) => (
            <Card key={index} className="bg-secondary/30 border-border/50">
              <CardContent className="p-3">
                <div className="flex items-start gap-2">
                  <div className="pt-2 text-muted-foreground cursor-grab">
                    <GripVertical className="h-4 w-4" />
                  </div>
                  <div className="flex-1 grid gap-2" style={{ 
                    gridTemplateColumns: `repeat(${Math.min(fields.length, 3)}, 1fr)` 
                  }}>
                    {fields.map((field) => (
                      <div key={field.name} className="space-y-1">
                        <Label className="text-xs text-muted-foreground">{field.label}</Label>
                        <Input
                          type={field.type === 'textarea' ? 'text' : field.type}
                          value={item[field.name as keyof T] || ''}
                          onChange={(e) => onChange(index, field.name as keyof T, e.target.value)}
                          placeholder={field.placeholder}
                          className="h-8 text-sm bg-background/50"
                        />
                      </div>
                    ))}
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => onRemove(index)}
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
