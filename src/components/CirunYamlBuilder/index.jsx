import React, { useMemo, useState } from 'react';
import {
  CLOUDS,
  SUPPORTED,
  OS_OPTIONS,
  ARCH_OPTIONS,
  REGIONS,
  CPU_SIZES,
  SIZE_ORDER,
  GPU_PRESETS,
  AWS_AMIS,
  AWS_GPU_AMIS,
  AZURE_IMAGES,
  GCP_IMAGES,
  ON_PREM_OS,
  ON_PREM_SIZES,
  VASTAI_GPUS,
  VASTAI_MODES,
} from './data';
import styles from './styles.module.css';

function indent(str, spaces) {
  const pad = ' '.repeat(spaces);
  return str.split('\n').map((l) => (l.length ? pad + l : l)).join('\n');
}

function yamlScalar(v) {
  if (typeof v !== 'string') return String(v);
  if (/^[A-Za-z0-9._/-]+$/.test(v)) return v;
  return `"${v.replace(/"/g, '\\"')}"`;
}

const NOT_WIRED = 'Cirun supports this combination — it is just not yet wired into this UI. Write the YAML by hand using the YAML reference for the full schema.';

function buildAws(opts) {
  const { os, arch, region, workload, size, gpuPresetId, spot, diskGb, label } = opts;
  let instance, gpuField = null, imageBlock;

  if (workload === 'gpu') {
    const preset = (GPU_PRESETS.aws.find((p) => p.id === gpuPresetId)) || GPU_PRESETS.aws[0];
    instance = preset.instance;
    const ami = AWS_GPU_AMIS[region];
    if (!ami) return { error: NOT_WIRED };
    imageBlock = `    machine_image: ${ami}  # Deep Learning OSS Nvidia Driver AMI (PyTorch, Ubuntu 22.04)`;
  } else {
    instance = CPU_SIZES.aws[arch]?.[size]?.type;
    if (!instance) return { error: NOT_WIRED };
    const ami = AWS_AMIS[os]?.[arch]?.[region];
    if (!ami) return { error: NOT_WIRED };
    imageBlock = `    machine_image: ${ami}  # ${os} ${arch}`;
  }

  const lines = ['runners:'];
  lines.push(`  - name: ${label}`);
  lines.push('    cloud: aws');
  lines.push(`    instance_type: ${instance}`);
  lines.push(imageBlock);
  lines.push(`    region: ${region}`);
  if (gpuField) lines.push(`    gpu: ${gpuField}`);
  if (spot) lines.push('    preemptible: true');

  const disk = parseInt(diskGb, 10);
  if (Number.isFinite(disk) && disk > 0) {
    lines.push('    extra_config:');
    lines.push(indent(`BlockDeviceMappings:\n  - DeviceName: /dev/sda1\n    VolumeSize: ${disk}\n    VolumeType: gp3`, 6));
  }
  lines.push('    labels:');
  lines.push(`      - ${label}`);
  return { yaml: lines.join('\n') + '\n' };
}

function buildAzure(opts) {
  const { os, arch, region, workload, size, gpuPresetId, spot, diskGb, label } = opts;
  let instance, imageBlock;

  if (workload === 'gpu') {
    const preset = (GPU_PRESETS.azure.find((p) => p.id === gpuPresetId)) || GPU_PRESETS.azure[0];
    instance = preset.instance;
  } else {
    instance = CPU_SIZES.azure[arch]?.[size]?.type;
    if (!instance) return { error: NOT_WIRED };
  }

  const img = AZURE_IMAGES[os]?.[arch];
  if (!img) return { error: NOT_WIRED };
  if (typeof img === 'string') {
    imageBlock = `    machine_image: ${yamlScalar(img)}`;
  } else {
    imageBlock = '    machine_image:\n'
      + `      publisher: ${img.publisher}\n`
      + `      offer: ${img.offer}\n`
      + `      sku: ${img.sku}\n`
      + `      version: ${img.version}`;
  }

  const lines = ['runners:'];
  lines.push(`  - name: ${label}`);
  lines.push('    cloud: azure');
  lines.push(`    instance_type: ${instance}`);
  lines.push(imageBlock);
  lines.push(`    region: ${region}`);
  if (spot) lines.push('    preemptible: true');

  const extra = ['boot_diagnostics: true'];
  const disk = parseInt(diskGb, 10);
  if (Number.isFinite(disk) && disk > 0) {
    extra.push(`storageProfile:\n  osDisk:\n    diskSizeGB: ${disk}`);
  }
  lines.push('    extra_config:');
  lines.push(indent(extra.join('\n'), 6));
  lines.push('    labels:');
  lines.push(`      - ${label}`);
  return { yaml: lines.join('\n') + '\n' };
}

function buildGcp(opts) {
  const { os, arch, region, workload, size, gpuPresetId, spot, diskGb, label } = opts;
  let instance, gpuField = null;

  if (workload === 'gpu') {
    const preset = (GPU_PRESETS.gcp.find((p) => p.id === gpuPresetId)) || GPU_PRESETS.gcp[0];
    instance = preset.instance;
    if (preset.gpu) gpuField = preset.gpu;
  } else {
    instance = CPU_SIZES.gcp[arch]?.[size]?.type;
    if (!instance) return { error: NOT_WIRED };
  }
  const img = GCP_IMAGES[os]?.[arch];
  if (!img) return { error: NOT_WIRED };

  const lines = ['runners:'];
  lines.push(`  - name: ${label}`);
  lines.push('    cloud: gcp');
  lines.push(`    instance_type: ${instance}`);
  lines.push(`    machine_image: ${img}`);
  lines.push(`    region: ${region}`);
  if (gpuField) lines.push(`    gpu: ${gpuField}`);
  if (spot) lines.push('    preemptible: true');
  const disk = parseInt(diskGb, 10);
  if (Number.isFinite(disk) && disk > 0) {
    lines.push('    extra_config:');
    lines.push(indent(`baseDisk:\n  diskSizeGb: ${disk}`, 6));
  }
  lines.push('    labels:');
  lines.push(`      - ${label}`);
  return { yaml: lines.join('\n') + '\n' };
}

function buildOnPrem({ onPremOs, onPremSize, label }) {
  const osDef = ON_PREM_OS.find((o) => o.id === onPremOs) || ON_PREM_OS[0];
  const sizeDef = ON_PREM_SIZES.find((s) => s.id === onPremSize) || ON_PREM_SIZES[1];
  const lines = ['runners:'];
  lines.push(`  - name: ${label}`);
  lines.push('    cloud: on_prem');
  lines.push(`    instance_type: ${sizeDef.type}`);
  lines.push(`    machine_image: ${yamlScalar(osDef.image)}`);
  lines.push('    region: RegionOne');
  lines.push('    labels:');
  lines.push(`      - ${label}`);
  return { yaml: lines.join('\n') + '\n' };
}

function buildVastAi({ vastGpuId, vastModeId, diskGb, label }) {
  const gpu = VASTAI_GPUS.find((g) => g.id === vastGpuId) || VASTAI_GPUS[0];
  const mode = VASTAI_MODES.find((m) => m.id === vastModeId) || VASTAI_MODES[0];
  const lines = ['runners:'];
  lines.push(`  - name: ${label}`);
  lines.push('    cloud: vast_ai');
  lines.push(`    instance_type: ${gpu.type}`);
  lines.push(`    machine_image: ${yamlScalar(mode.defaultImage)}`);
  lines.push('    labels:');
  lines.push(`      - ${label}`);
  const extra = [];
  const disk = parseInt(diskGb, 10);
  if (Number.isFinite(disk) && disk > 0) extra.push(`disk_space: ${disk}`);
  if (mode.id === 'vm') extra.push('vm: true');
  if (extra.length) {
    lines.push('    extra_config:');
    lines.push(indent(extra.join('\n'), 6));
  }
  return { yaml: lines.join('\n') + '\n' };
}

function highlightYaml(yaml) {
  const out = [];
  yaml.split('\n').forEach((line, i) => {
    if (!line) {
      out.push(<span key={i} className={styles.line}>{' '}</span>);
      return;
    }
    const parts = [];
    let rest = line;
    const lead = (rest.match(/^(\s*)/) || [''])[0];
    if (lead) parts.push(<span key="lead">{lead}</span>);
    rest = rest.slice(lead.length);

    if (rest.startsWith('# ') || rest === '#') {
      parts.push(<span key="cmt" className={styles.tComment}>{rest}</span>);
    } else if (rest.startsWith('- ')) {
      parts.push(<span key="dash" className={styles.tPunct}>- </span>);
      pushKeyValue(parts, rest.slice(2));
    } else {
      pushKeyValue(parts, rest);
    }
    out.push(<span key={i} className={styles.line}>{parts}{'\n'}</span>);
  });
  return out;
}

function pushKeyValue(parts, rest) {
  const kv = rest.match(/^([A-Za-z_][\w-]*):(\s*)(.*)$/);
  if (kv) {
    parts.push(<span key="k" className={styles.tKey}>{kv[1]}</span>);
    parts.push(<span key="c" className={styles.tPunct}>:</span>);
    if (kv[2]) parts.push(<span key="s">{kv[2]}</span>);
    if (kv[3]) splitValueComment(parts, kv[3]);
    return;
  }
  parts.push(<span key="raw">{rest}</span>);
}

function splitValueComment(parts, val) {
  const cmt = val.match(/^(.*?)(\s+#.*)$/);
  if (cmt) {
    parts.push(<span key="v" className={styles.tValue}>{cmt[1]}</span>);
    parts.push(<span key="vc" className={styles.tComment}>{cmt[2]}</span>);
  } else {
    parts.push(<span key="v" className={styles.tValue}>{val}</span>);
  }
}

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const onClick = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (_) {}
  };
  return (
    <button
      type="button"
      className={`${styles.copyBtn} ${copied ? styles.copied : ''}`}
      onClick={onClick}
      aria-label={copied ? 'Copied' : 'Copy to clipboard'}
    >
      {copied ? <CheckIcon /> : <CopyIcon />}
      <span>{copied ? 'Copied' : 'Copy'}</span>
    </button>
  );
}

const CopyIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);
const CheckIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const FileIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
  </svg>
);
const InfoIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
);

function StepBadge({ n, label }) {
  return (
    <div className={styles.stepHeader}>
      <span className={styles.stepBadge}>{String(n).padStart(2, '0')}</span>
      <span className={styles.stepLabel}>{label}</span>
    </div>
  );
}

function Segmented({ value, onChange, options, ariaLabel }) {
  return (
    <div className={styles.segmented} role="radiogroup" aria-label={ariaLabel}>
      {options.map((opt) => (
        <button
          key={opt.id}
          type="button"
          role="radio"
          aria-checked={value === opt.id}
          className={`${styles.segItem} ${value === opt.id ? styles.segActive : ''}`}
          onClick={() => onChange(opt.id)}
          disabled={opt.disabled}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function Toggle({ checked, onChange }) {
  return (
    <label className={`${styles.switch} ${checked ? styles.switchOn : ''}`}>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className={styles.switchThumb} />
    </label>
  );
}

function Field({ label, htmlFor, children }) {
  return (
    <div className={styles.field}>
      <label htmlFor={htmlFor}>{label}</label>
      {children}
    </div>
  );
}

export default function CirunYamlBuilder() {
  const [cloud, setCloud] = useState('aws');
  const [os, setOs] = useState('linux');
  const [arch, setArch] = useState('x86_64');
  const [region, setRegion] = useState(REGIONS.aws[0].id);
  const [workload, setWorkload] = useState('cpu');
  const [size, setSize] = useState('medium');
  const [gpuPresetId, setGpuPresetId] = useState(GPU_PRESETS.aws[0].id);
  const [spot, setSpot] = useState(false);
  const [diskGb, setDiskGb] = useState('');
  const [onPremOs, setOnPremOs] = useState(ON_PREM_OS[0].id);
  const [onPremSize, setOnPremSize] = useState(ON_PREM_SIZES[1].id);
  const [vastGpuId, setVastGpuId] = useState(VASTAI_GPUS[0].id);
  const [vastModeId, setVastModeId] = useState(VASTAI_MODES[0].id);

  const supported = SUPPORTED.includes(cloud);

  const onCloudClick = (next) => {
    setCloud(next);
    if (!SUPPORTED.includes(next)) return;
    if (next === 'on_prem' || next === 'vast_ai') return;
    if (REGIONS[next]) setRegion(REGIONS[next][0].id);
    if (workload === 'gpu' && GPU_PRESETS[next]) setGpuPresetId(GPU_PRESETS[next][0].id);
  };

  const archDisabled = os === 'windows' || os === 'macos';
  const effectiveArch = os === 'macos' ? 'arm64' : (os === 'windows' ? 'x86_64' : arch);
  const underlyingOs = OS_OPTIONS.find((o) => o.id === os)?.underlying || 'ubuntu-2204';

  const sizeOptions = useMemo(() => {
    if (!CPU_SIZES[cloud]) return [];
    return SIZE_ORDER.map((s) => ({
      id: s,
      label: CPU_SIZES[cloud]?.[effectiveArch]?.[s]?.label || s,
    }));
  }, [cloud, effectiveArch]);

  const label = useMemo(() => {
    if (cloud === 'on_prem') return `cirun-onprem-${onPremOs}-${onPremSize}`;
    if (cloud === 'vast_ai') return `cirun-vast-${vastGpuId}`;
    if (workload === 'gpu') return `cirun-${cloud}-gpu-${gpuPresetId}`;
    return `cirun-${cloud}-${size}`;
  }, [cloud, workload, size, gpuPresetId, onPremOs, onPremSize, vastGpuId]);

  const { yaml, error } = useMemo(() => {
    if (!supported) {
      return { yaml: '', error: 'Cirun supports this cloud — it is just not yet wired into this UI. Write the YAML by hand using the YAML reference for the full schema.' };
    }
    const opts = { os: underlyingOs, arch: effectiveArch, region, workload, size, gpuPresetId, spot, diskGb, label, onPremOs, onPremSize, vastGpuId, vastModeId };
    let res;
    if (cloud === 'aws') res = buildAws(opts);
    else if (cloud === 'azure') res = buildAzure(opts);
    else if (cloud === 'gcp') res = buildGcp(opts);
    else if (cloud === 'on_prem') res = buildOnPrem(opts);
    else if (cloud === 'vast_ai') res = buildVastAi(opts);
    else res = { error: 'Unknown cloud.' };
    return { yaml: res.yaml || '', error: res.error || null };
  }, [supported, cloud, os, effectiveArch, region, workload, size, gpuPresetId, spot, diskGb, label, onPremOs, onPremSize, vastGpuId, vastModeId]);

  const isOnPrem = cloud === 'on_prem';
  const isVast = cloud === 'vast_ai';
  const isCloud = ['aws', 'azure', 'gcp'].includes(cloud);

  return (
    <section className={styles.builder}>
      {/* Step 01 — Cloud */}
      <div className={styles.step}>
        <StepBadge n={1} label="Cloud" />
        <div className={styles.cloudGrid}>
          {CLOUDS.map((c) => (
            <button
              key={c.id}
              type="button"
              className={`${styles.cloudCard} ${cloud === c.id ? styles.cloudActive : ''}`}
              onClick={() => onCloudClick(c.id)}
              aria-pressed={cloud === c.id}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Step 02 — Machine */}
      <div className={styles.step}>
        <StepBadge n={2} label="Machine" />
        <div className={styles.machineGrid}>
          {isCloud && (
            <>
              <Field label="OS" htmlFor="cyb-os">
                <select id="cyb-os" value={os} onChange={(e) => setOs(e.target.value)}>
                  {OS_OPTIONS.map((o) => (
                    <option key={o.id} value={o.id}>{o.label}</option>
                  ))}
                </select>
              </Field>
              <Field label="Arch">
                <Segmented
                  value={effectiveArch}
                  onChange={setArch}
                  options={ARCH_OPTIONS.map((a) => ({ ...a, disabled: archDisabled }))}
                  ariaLabel="Architecture"
                />
              </Field>
              <Field label="Workload">
                <Segmented
                  value={workload}
                  onChange={setWorkload}
                  options={[{ id: 'cpu', label: 'CPU' }, { id: 'gpu', label: 'GPU' }]}
                  ariaLabel="Workload"
                />
              </Field>
              <Field label={workload === 'gpu' ? 'GPU' : 'Size'} htmlFor="cyb-size">
                {workload === 'gpu' ? (
                  <select id="cyb-size" value={gpuPresetId} onChange={(e) => setGpuPresetId(e.target.value)}>
                    {(GPU_PRESETS[cloud] || []).map((g) => (
                      <option key={g.id} value={g.id}>{g.label}</option>
                    ))}
                  </select>
                ) : (
                  <select id="cyb-size" value={size} onChange={(e) => setSize(e.target.value)}>
                    {sizeOptions.map((s) => (
                      <option key={s.id} value={s.id}>{s.label}</option>
                    ))}
                  </select>
                )}
              </Field>
            </>
          )}

          {isOnPrem && (
            <>
              <Field label="OS" htmlFor="cyb-onprem-os">
                <select id="cyb-onprem-os" value={onPremOs} onChange={(e) => setOnPremOs(e.target.value)}>
                  {ON_PREM_OS.map((o) => (
                    <option key={o.id} value={o.id}>{o.label}</option>
                  ))}
                </select>
              </Field>
              <Field label="Size" htmlFor="cyb-onprem-size">
                <select id="cyb-onprem-size" value={onPremSize} onChange={(e) => setOnPremSize(e.target.value)}>
                  {ON_PREM_SIZES.map((s) => (
                    <option key={s.id} value={s.id}>{s.label}</option>
                  ))}
                </select>
              </Field>
            </>
          )}

          {isVast && (
            <>
              <Field label="Mode">
                <Segmented
                  value={vastModeId}
                  onChange={setVastModeId}
                  options={VASTAI_MODES.map((m) => ({ id: m.id, label: m.label }))}
                  ariaLabel="Vast.ai mode"
                />
              </Field>
              <Field label="GPU" htmlFor="cyb-vast-gpu">
                <select id="cyb-vast-gpu" value={vastGpuId} onChange={(e) => setVastGpuId(e.target.value)}>
                  {VASTAI_GPUS.map((g) => (
                    <option key={g.id} value={g.id}>{g.label}</option>
                  ))}
                </select>
              </Field>
            </>
          )}
        </div>
      </div>

      {/* Step 03 — Placement */}
      {(isCloud || isVast) && (
        <div className={styles.step}>
          <StepBadge n={3} label="Placement & tweaks" />
          <div className={styles.placementGrid}>
            {isCloud && (
              <Field label="Region" htmlFor="cyb-region">
                <select id="cyb-region" value={region} onChange={(e) => setRegion(e.target.value)}>
                  {(REGIONS[cloud] || []).map((r) => (
                    <option key={r.id} value={r.id}>{r.label}</option>
                  ))}
                </select>
              </Field>
            )}

            {(isCloud || isVast) && (
              <Field label="Disk (GiB)" htmlFor="cyb-disk">
                <input
                  id="cyb-disk"
                  type="number"
                  min="0"
                  placeholder="default"
                  value={diskGb}
                  onChange={(e) => setDiskGb(e.target.value)}
                />
              </Field>
            )}

            {isCloud && (
              <Field label="Spot / preemptible">
                <div className={styles.toggleHolder}>
                  <Toggle checked={spot} onChange={setSpot} />
                </div>
              </Field>
            )}
          </div>
        </div>
      )}

      {/* Output */}
      <div className={styles.outputBlock}>
        <div className={styles.outputHeader}>
          <span className={styles.outputName}>
            <FileIcon />
            <code>.cirun.yml</code>
          </span>
          {!error && <CopyButton text={yaml} />}
        </div>
        {error ? (
          <div className={styles.errorBody}>{error}</div>
        ) : (
          <pre className={styles.code}>{highlightYaml(yaml)}</pre>
        )}
      </div>

      <div className={styles.note}>
        <InfoIcon />
        <span>
          Commit this file to your repo root as <code>.cirun.yml</code>. Cirun reads it on every push.{' '}
          {isOnPrem
            ? <a href="/on-prem">Set up cirun-agent →</a>
            : <a href="/quickstart">Read the quickstart →</a>}
        </span>
      </div>
    </section>
  );
}
