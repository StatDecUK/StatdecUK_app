
Action: file_editor create /app/frontend/src/pages/Editor.jsx --file-text "import { useEffect, useMemo, useRef, useState } from \"react\";
import { useParams, useNavigate } from \"react-router-dom\";
import Layout from \"@/components/Layout\";
import { api, extractError } from \"@/lib/api\";
import {
  declarationTypes,
  legalDatabase,
  buildDeclarationText,
  buildExhibitText,
} from \"@/lib/legalDatabase\";
import { Button } from \"@/components/ui/button\";
import { Input } from \"@/components/ui/input\";
import { Label } from \"@/components/ui/label\";
import { Textarea } from \"@/components/ui/textarea\";
import { Checkbox } from \"@/components/ui/checkbox\";
import { Tabs, TabsList, TabsTrigger, TabsContent } from \"@/components/ui/tabs\";
import { Separator } from \"@/components/ui/separator\";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from \"@/components/ui/select\";
import { Save, Printer, Download, Info, ArrowLeft } from \"lucide-react\";
import { toast } from \"sonner\";
import { downloadPdf, printElements } from \"@/lib/pdfExport\";

export default function Editor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);

  const [title, setTitle] = useState(\"\");
  const [templateId, setTemplateId] = useState(\"2\");
  const [declarantName, setDeclarantName] = useState(\"John Doe\");
  const [declarantAddress, setDeclarantAddress] = useState(\"123 High Street, Cardiff, CF10 1FF\");
  const [declarantOccupation, setDeclarantOccupation] = useState(\"Company Director\");
  const [statementBody, setStatementBody] = useState(legalDatabase[\"2\"].wording);
  const [selectedExhibits, setSelectedExhibits] = useState([\"A\", \"B\"]);
  const [exhibitPages, setExhibitPages] = useState({ A: 4, B: 4 });
  const [exhibitDescriptions, setExhibitDescriptions] = useState({
    A: legalDatabase[\"2\"].exhibits.A,
    B: legalDatabase[\"2\"].exhibits.B,
  });

  const declarationRef = useRef(null);
  const exhibitRefs = useRef({});

  const tpl = legalDatabase[templateId];
  const availableLetters = useMemo(() => Object.keys(tpl?.exhibits || {}), [tpl]);

  // Load existing
  useEffect(() => {
    if (!isEdit) return;
    (async () => {
      try {
        const { data } = await api.get(`/declarations/${id}`);
        setTitle(data.title || \"\");
        setTemplateId(data.template_id);
        setDeclarantName(data.declarant_name);
        setDeclarantAddress(data.declarant_address);
        setDeclarantOccupation(data.declarant_occupation);
        setStatementBody(data.statement_body);
        setSelectedExhibits(data.selected_exhibits || []);
        setExhibitPages(data.exhibit_pages || {});
        setExhibitDescriptions(data.exhibit_descriptions || {});
      } catch (e) {
        toast.error(extractError(e));
        navigate(\"/dashboard\");
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // When template changes, prefill from template
  function handleTemplateChange(newId) {
    setTemplateId(newId);
    const data = legalDatabase[newId];
    setStatementBody(data.wording);
    const letters = Object.keys(data.exhibits);
    // default select all
    setSelectedExhibits(letters);
    const pages = {};
    const descs = {};
    letters.forEach((l) => {
      pages[l] = 4;
      descs[l] = data.exhibits[l];
    });
    setExhibitPages(pages);
    setExhibitDescriptions(descs);
  }

  function toggleExhibit(letter) {
    setSelectedExhibits((prev) =>
      prev.includes(letter) ? prev.filter((l) => l !== letter) : [...prev, letter].sort()
    );
    if (!exhibitPages[letter]) {
      setExhibitPages((p) => ({ ...p, [letter]: 4 }));
    }
    if (!exhibitDescriptions[letter]) {
      setExhibitDescriptions((d) => ({ ...d, [letter]: tpl.exhibits[letter] || \"\" }));
    }
  }

  function updatePages(letter, val) {
    setExhibitPages((p) => ({ ...p, [letter]: Math.max(1, parseInt(val || \"1\", 10)) }));
  }

  function updateDesc(letter, val) {
    setExhibitDescriptions((d) => ({ ...d, [letter]: val }));
  }

  async function handleSave() {
    setSaving(true);
    const payload = {
      title: title || null,
      template_id: templateId,
      declarant_name: declarantName,
      declarant_address: declarantAddress,
      declarant_occupation: declarantOccupation,
      statement_body: statementBody,
      selected_exhibits: selectedExhibits,
      exhibit_pages: exhibitPages,
      exhibit_descriptions: exhibitDescriptions,
    };
    try {
      if (isEdit) {
        await api.put(`/declarations/${id}`, payload);
        toast.success(\"Declaration saved\");
      } else {
        const { data } = await api.post(\"/declarations\", payload);
        toast.success(\"Declaration saved\");
        navigate(`/editor/${data.id}`, { replace: true });
      }
    } catch (e) {
      toast.error(extractError(e));
    } finally {
      setSaving(false);
    }
  }

  function collectElements() {
    const els = [];
    if (declarationRef.current) els.push(declarationRef.current);
    selectedExhibits.forEach((l) => {
      const el = exhibitRefs.current[l];
      if (el) els.push(el);
    });
    return els;
  }

  function handlePrint() {
    printElements(collectElements());
  }

  async function handleDownloadPdf() {
    setExporting(true);
    try {
      const elements = collectElements();
      const safeName = (declarantName || \"declaration\").replace(/[^a-z0-9]+/gi, \"-\");
      await downloadPdf(elements, `${safeName}-statutory-declaration.pdf`);
      toast.success(\"PDF downloaded\");
    } catch (e) {
      toast.error(\"Could not generate PDF\");
    } finally {
      setExporting(false);
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className=\"text-neutral-500\" data-testid=\"editor-loading\">Loading declaration…</div>
      </Layout>
    );
  }

  const declarationText = buildDeclarationText({
    name: declarantName,
    address: declarantAddress,
    occupation: declarantOccupation,
    body: statementBody,
    templateId,
  });

  return (
    <Layout>
      <div className=\"flex items-center justify-between mb-6\">
        <button
          onClick={() => navigate(\"/dashboard\")}
          className=\"flex items-center gap-2 text-sm text-neutral-600 hover:text-black transition-colors\"
          data-testid=\"back-to-dashboard\"
        >
          <ArrowLeft className=\"w-4 h-4\" /> Back to workspace
        </button>
        <div className=\"flex items-center gap-2\">
          <Button
            variant=\"outline\"
            onClick={handlePrint}
            className=\"rounded-sm border-neutral-300\"
            data-testid=\"print-button\"
          >
            <Printer className=\"w-4 h-4 mr-2\" /> Print
          </Button>
          <Button
            variant=\"outline\"
            onClick={handleDownloadPdf}
            disabled={exporting}
            className=\"rounded-sm border-neutral-300\"
            data-testid=\"download-pdf-button\"
          >
            <Download className=\"w-4 h-4 mr-2\" />
            {exporting ? \"Building PDF…\" : \"Download PDF\"}
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving}
            className=\"rounded-sm bg-black hover:bg-neutral-800\"
            data-testid=\"save-button\"
          >
            <Save className=\"w-4 h-4 mr-2\" /> {saving ? \"Saving…\" : \"Save\"}
          </Button>
        </div>
      </div>

      <div className=\"mb-8\">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder=\"Untitled declaration\"
          className=\"border-0 border-b border-neutral-200 rounded-none px-0 text-3xl md:text-4xl font-serif-display h-auto py-3 focus-visible:ring-0 focus-visible:border-black bg-transparent\"
          data-testid=\"title-input\"
        />
      </div>

      <div className=\"grid lg:grid-cols-12 gap-8\">
        {/* LEFT — Form */}
        <div className=\"lg:col-span-5 space-y-8\">
          <section className=\"bg-white border border-neutral-200 rounded-sm p-6\">
            <div className=\"text-xs uppercase tracking-[0.2em] text-neutral-500 mb-4\">
              01 · Type & Profile
            </div>
            <Label className=\"text-xs uppercase tracking-wider text-neutral-600 mb-2 block\">
              Declaration type
            </Label>
            <Select value={templateId} onValueChange={handleTemplateChange}>
              <SelectTrigger className=\"rounded-sm h-11\" data-testid=\"template-select\">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {declarationTypes.map((group) => (
                  <SelectGroup key={group.group}>
                    <SelectLabel className=\"text-[10px] uppercase tracking-[0.18em] text-neutral-500\">
                      {group.group}
                    </SelectLabel>
                    {group.items.map((it) => (
                      <SelectItem key={it.id} value={it.id} data-testid={`template-option-${it.id}`}>
                        {it.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                ))}
              </SelectContent>
            </Select>

            <div className=\"mt-4 flex gap-3 p-3 bg-neutral-50 border-l-2 border-black text-xs text-neutral-700\">
              <Info className=\"w-4 h-4 mt-0.5 shrink-0\" />
              <span data-testid=\"apostille-info\">{tpl.apostille}</span>
            </div>

            <Separator className=\"my-6\" />

            <div className=\"space-y-4\">
              <div>
                <Label className=\"text-xs uppercase tracking-wider text-neutral-600 mb-2 block\">
                  Declarant full name
                </Label>
                <Input
                  value={declarantName}
                  onChange={(e) => setDeclarantName(e.target.value)}
                  className=\"rounded-sm h-10\"
                  data-testid=\"declarant-name-input\"
                />
              </div>
              <div>
                <Label className=\"text-xs uppercase tracking-wider text-neutral-600 mb-2 block\">
                  Residential address
                </Label>
                <Input
                  value={declarantAddress}
                  onChange={(e) => setDeclarantAddress(e.target.value)}
                  className=\"rounded-sm h-10\"
                  data-testid=\"declarant-address-input\"
                />
              </div>
              <div>
                <Label className=\"text-xs uppercase tracking-wider text-neutral-600 mb-2 block\">
                  Occupation
                </Label>
                <Input
                  value={declarantOccupation}
                  onChange={(e) => setDeclarantOccupation(e.target.value)}
                  className=\"rounded-sm h-10\"
                  data-testid=\"declarant-occupation-input\"
                />
              </div>
            </div>
          </section>

          <section className=\"bg-white border border-neutral-200 rounded-sm p-6\">
            <div className=\"text-xs uppercase tracking-[0.2em] text-neutral-500 mb-4\">
              02 · Statement wording
            </div>
            <Textarea
              value={statementBody}
              onChange={(e) => setStatementBody(e.target.value)}
              rows={10}
              className=\"rounded-sm font-mono-doc text-[12.5px] leading-relaxed\"
              data-testid=\"statement-body-textarea\"
            />
            <p className=\"text-xs text-neutral-500 mt-2\">
              Pre-filled from the selected type. Edit freely — exhibits reference letters
              ('A', 'B' …) in this text.
            </p>
          </section>

          <section className=\"bg-white border border-neutral-200 rounded-sm p-6\">
            <div className=\"text-xs uppercase tracking-[0.2em] text-neutral-500 mb-4\">
              03 · Exhibits ({selectedExhibits.length} selected)
            </div>
            <p className=\"text-xs text-neutral-500 mb-4\">
              Select all exhibits to include. Each generates its own cover sheet and is
              included in print/PDF outputs.
            </p>
            <div className=\"space-y-3\">
              {availableLetters.map((letter) => {
                const checked = selectedExhibits.includes(letter);
                return (
                  <div
                    key={letter}
                    className={`border rounded-sm p-4 transition-colors ${
                      checked ? \"border-black bg-neutral-50\" : \"border-neutral-200\"
                    }`}
                    data-testid={`exhibit-card-${letter}`}
                  >
                    <div className=\"flex items-start gap-3\">
                      <Checkbox
                        id={`ex-${letter}`}
                        checked={checked}
                        onCheckedChange={() => toggleExhibit(letter)}
                        className=\"mt-1 rounded-sm\"
                        data-testid={`exhibit-checkbox-${letter}`}
                      />
                      <div className=\"flex-1\">
                        <Label
                          htmlFor={`ex-${letter}`}
                          className=\"font-serif-display text-lg cursor-pointer\"
                        >
                          Exhibit {letter}
                        </Label>
                        <p className=\"text-xs text-neutral-600 mt-1\">
                          {tpl.exhibits[letter]}
                        </p>
                        {checked && (
                          <div className=\"mt-3 space-y-2\">
                            <div className=\"flex items-center gap-3\">
                              <Label className=\"text-xs text-neutral-600 w-20\">Total pages</Label>
                              <Input
                                type=\"number\"
                                min={1}
                                value={exhibitPages[letter] ?? 1}
                                onChange={(e) => updatePages(letter, e.target.value)}
                                className=\"rounded-sm h-8 w-24\"
                                data-testid={`exhibit-pages-${letter}`}
                              />
                            </div>
                            <Textarea
                              value={exhibitDescriptions[letter] ?? \"\"}
                              onChange={(e) => updateDesc(letter, e.target.value)}
                              rows={2}
                              className=\"rounded-sm text-xs\"
                              placeholder=\"Cover description\"
                              data-testid={`exhibit-desc-${letter}`}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        {/* RIGHT — Preview */}
        <div className=\"lg:col-span-7\">
          <div className=\"sticky top-24\">
            <Tabs defaultValue=\"declaration\">
              <TabsList className=\"rounded-sm bg-neutral-100 p-1\">
                <TabsTrigger value=\"declaration\" className=\"rounded-sm\" data-testid=\"tab-declaration\">
                  Declaration
                </TabsTrigger>
                {selectedExhibits.map((l) => (
                  <TabsTrigger
                    key={l}
                    value={`exhibit-${l}`}
                    className=\"rounded-sm\"
                    data-testid={`tab-exhibit-${l}`}
                  >
                    Exhibit {l}
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value=\"declaration\" className=\"mt-4\">
                <div className=\"bg-neutral-100 p-6 lg:p-10 rounded-sm\">
                  <div
                    ref={declarationRef}
                    className=\"a4-paper\"
                    data-testid=\"declaration-preview\"
                  >
                    <h2>Statutory Declaration</h2>
                    {declarationText}
                  </div>
                </div>
              </TabsContent>

              {selectedExhibits.map((l) => (
                <TabsContent key={l} value={`exhibit-${l}`} className=\"mt-4\">
                  <div className=\"bg-neutral-100 p-6 lg:p-10 rounded-sm\">
                    <div
                      ref={(el) => (exhibitRefs.current[l] = el)}
                      className=\"a4-paper\"
                      data-testid={`exhibit-preview-${l}`}
                    >
                      <h2>Exhibit Cover Sheet</h2>
                      {buildExhibitText({
                        letter: l,
                        name: declarantName,
                        pages: exhibitPages[l] || 1,
                        description: exhibitDescriptions[l] || tpl.exhibits[l] || \"\",
                      })}
                    </div>
                  </div>
                </TabsContent>
              ))}
            </Tabs>

            {/* Hidden off-screen container with ALL pages stacked for PDF capture */}
            <div className=\"sr-only\" aria-hidden=\"true\">
              {/* keep refs alive even if user is on a tab that doesn't show them */}
              {selectedExhibits.map((l) => {
                if (exhibitRefs.current[l]) return null;
                return (
                  <div
                    key={`hidden-${l}`}
                    ref={(el) => (exhibitRefs.current[l] = el)}
                    className=\"a4-paper\"
                  >
                    {buildExhibitText({
                      letter: l,
                      name: declarantName,
                      pages: exhibitPages[l] || 1,
                      description: exhibitDescriptions[l] || tpl.exhibits[l] || \"\",
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
"
Observation: Create successful: /app/frontend/src/pages/Editor.jsx
