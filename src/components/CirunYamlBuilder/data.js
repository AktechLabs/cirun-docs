// All images are public and verified from the cirun-go-demo reference repo.
// AMIs / image versions move over time — refresh from:
//   AWS Ubuntu:    https://cloud-images.ubuntu.com/locator/ec2/
//   AWS DLAMI:     EC2 console → AMIs → search "Deep Learning OSS Nvidia"
//   AWS Windows:   EC2 console → AMIs → search "Windows_Server-2022-English-Full-Base"
//   Azure URNs:    az vm image list --publisher Canonical --all
//   GCP images:    gcloud compute images list --project ubuntu-os-cloud

export const CLOUDS = [
  { id: 'aws',       label: 'AWS',          color: '#ff9900' },
  { id: 'azure',     label: 'Azure',        color: '#0089d6' },
  { id: 'gcp',       label: 'GCP',          color: '#4285f4' },
  { id: 'do',        label: 'DigitalOcean', color: '#0080ff' },
  { id: 'oracle',    label: 'Oracle',       color: '#f80000' },
  { id: 'openstack', label: 'OpenStack',    color: '#ed1944' },
  { id: 'vast_ai',   label: 'Vast.ai',      color: '#41c4b6' },
  { id: 'on_prem',   label: 'On-Prem',      color: '#a855f7' },
];

export const SUPPORTED = ['aws', 'azure', 'gcp', 'vast_ai', 'on_prem'];

export const OS_OPTIONS = [
  { id: 'linux',   label: 'Linux',   underlying: 'ubuntu-2204' },
  { id: 'windows', label: 'Windows', underlying: 'windows-2022' },
  { id: 'macos',   label: 'macOS',   underlying: 'macos' },
];

export const ARCH_OPTIONS = [
  { id: 'x86_64', label: 'x86_64' },
  { id: 'arm64',  label: 'ARM64' },
];

export const REGIONS = {
  aws: [
    { id: 'us-east-1', label: 'us-east-1 · N. Virginia' },
    { id: 'eu-west-1', label: 'eu-west-1 · Ireland' },
  ],
  azure: [
    { id: 'eastus',  label: 'eastus · Virginia' },
    { id: 'westus2', label: 'westus2 · Washington' },
  ],
  gcp: [
    { id: 'us-central1-a',  label: 'us-central1-a · Iowa' },
    { id: 'us-east1-b',     label: 'us-east1-b · S. Carolina' },
    { id: 'europe-west1-b', label: 'europe-west1-b · Belgium' },
  ],
};

// CPU presets — label shows vCPU count + memory
export const CPU_SIZES = {
  aws: {
    x86_64: {
      tiny:    { type: 't3.small',    label: 'Tiny — 2 vCPU · 2 GiB' },
      small:   { type: 't3.medium',   label: 'Small — 2 vCPU · 4 GiB' },
      medium:  { type: 't3.large',    label: 'Medium — 2 vCPU · 8 GiB' },
      large:   { type: 'm5.xlarge',   label: 'Large — 4 vCPU · 16 GiB' },
      xlarge:  { type: 'm5.2xlarge',  label: 'XLarge — 8 vCPU · 32 GiB' },
      '2xl':   { type: 'm5.4xlarge',  label: '2XLarge — 16 vCPU · 64 GiB' },
      '4xl':   { type: 'm5.8xlarge',  label: '4XLarge — 32 vCPU · 128 GiB' },
      '8xl':   { type: 'm5.16xlarge', label: '8XLarge — 64 vCPU · 256 GiB' },
      '16xl':  { type: 'm5.24xlarge', label: '16XLarge — 96 vCPU · 384 GiB' },
      mem_l:   { type: 'r5.xlarge',   label: 'High-mem L — 4 vCPU · 32 GiB' },
      mem_xl:  { type: 'r5.2xlarge',  label: 'High-mem XL — 8 vCPU · 64 GiB' },
      mem_2xl: { type: 'r5.4xlarge',  label: 'High-mem 2XL — 16 vCPU · 128 GiB' },
      mem_4xl: { type: 'r5.8xlarge',  label: 'High-mem 4XL — 32 vCPU · 256 GiB' },
      mem_8xl: { type: 'r5.16xlarge', label: 'High-mem 8XL — 64 vCPU · 512 GiB' },
    },
    arm64: {
      tiny:    { type: 'm6g.medium',  label: 'Tiny — 1 vCPU · 4 GiB' },
      small:   { type: 'm6g.large',   label: 'Small — 2 vCPU · 8 GiB' },
      medium:  { type: 'm6g.xlarge',  label: 'Medium — 4 vCPU · 16 GiB' },
      large:   { type: 'm6g.2xlarge', label: 'Large — 8 vCPU · 32 GiB' },
      xlarge:  { type: 'm6g.4xlarge', label: 'XLarge — 16 vCPU · 64 GiB' },
      '2xl':   { type: 'm6g.8xlarge', label: '2XLarge — 32 vCPU · 128 GiB' },
      '4xl':   { type: 'm6g.12xlarge', label: '4XLarge — 48 vCPU · 192 GiB' },
      '8xl':   { type: 'm6g.16xlarge', label: '8XLarge — 64 vCPU · 256 GiB' },
      mem_l:   { type: 'r6g.xlarge',   label: 'High-mem L — 4 vCPU · 32 GiB' },
      mem_xl:  { type: 'r6g.2xlarge',  label: 'High-mem XL — 8 vCPU · 64 GiB' },
      mem_2xl: { type: 'r6g.4xlarge',  label: 'High-mem 2XL — 16 vCPU · 128 GiB' },
      mem_4xl: { type: 'r6g.8xlarge',  label: 'High-mem 4XL — 32 vCPU · 256 GiB' },
    },
  },
  azure: {
    x86_64: {
      tiny:    { type: 'Standard_B1s',     label: 'Tiny — 1 vCPU · 1 GiB' },
      small:   { type: 'Standard_B2s',     label: 'Small — 2 vCPU · 4 GiB' },
      medium:  { type: 'Standard_D2s_v3',  label: 'Medium — 2 vCPU · 8 GiB' },
      large:   { type: 'Standard_D4s_v3',  label: 'Large — 4 vCPU · 16 GiB' },
      xlarge:  { type: 'Standard_D8s_v3',  label: 'XLarge — 8 vCPU · 32 GiB' },
      '2xl':   { type: 'Standard_D16s_v3', label: '2XLarge — 16 vCPU · 64 GiB' },
      '4xl':   { type: 'Standard_D32s_v3', label: '4XLarge — 32 vCPU · 128 GiB' },
      '8xl':   { type: 'Standard_D48s_v3', label: '8XLarge — 48 vCPU · 192 GiB' },
      '16xl':  { type: 'Standard_D64s_v3', label: '16XLarge — 64 vCPU · 256 GiB' },
      mem_l:   { type: 'Standard_E4s_v3',  label: 'High-mem L — 4 vCPU · 32 GiB' },
      mem_xl:  { type: 'Standard_E8s_v3',  label: 'High-mem XL — 8 vCPU · 64 GiB' },
      mem_2xl: { type: 'Standard_E16s_v3', label: 'High-mem 2XL — 16 vCPU · 128 GiB' },
      mem_4xl: { type: 'Standard_E32s_v3', label: 'High-mem 4XL — 32 vCPU · 256 GiB' },
      mem_8xl: { type: 'Standard_E64s_v3', label: 'High-mem 8XL — 64 vCPU · 432 GiB' },
    },
    arm64: {
      small:   { type: 'Standard_D2ps_v5',  label: 'Small — 2 vCPU · 8 GiB' },
      medium:  { type: 'Standard_D4ps_v5',  label: 'Medium — 4 vCPU · 16 GiB' },
      large:   { type: 'Standard_D8ps_v5',  label: 'Large — 8 vCPU · 32 GiB' },
      xlarge:  { type: 'Standard_D16ps_v5', label: 'XLarge — 16 vCPU · 64 GiB' },
      '2xl':   { type: 'Standard_D32ps_v5', label: '2XLarge — 32 vCPU · 128 GiB' },
      '4xl':   { type: 'Standard_D48ps_v5', label: '4XLarge — 48 vCPU · 192 GiB' },
      '8xl':   { type: 'Standard_D64ps_v5', label: '8XLarge — 64 vCPU · 256 GiB' },
    },
  },
  gcp: {
    x86_64: {
      tiny:    { type: 'e2-small',      label: 'Tiny — 0.5 vCPU · 2 GiB' },
      small:   { type: 'e2-medium',     label: 'Small — 1 vCPU · 4 GiB' },
      medium:  { type: 'e2-standard-2', label: 'Medium — 2 vCPU · 8 GiB' },
      large:   { type: 'e2-standard-4', label: 'Large — 4 vCPU · 16 GiB' },
      xlarge:  { type: 'e2-standard-8', label: 'XLarge — 8 vCPU · 32 GiB' },
      '2xl':   { type: 'e2-standard-16', label: '2XLarge — 16 vCPU · 64 GiB' },
      '4xl':   { type: 'e2-standard-32', label: '4XLarge — 32 vCPU · 128 GiB' },
      '8xl':   { type: 'n2-standard-48', label: '8XLarge — 48 vCPU · 192 GiB' },
      '16xl':  { type: 'n2-standard-64', label: '16XLarge — 64 vCPU · 256 GiB' },
      mem_l:   { type: 'n2-highmem-4',   label: 'High-mem L — 4 vCPU · 32 GiB' },
      mem_xl:  { type: 'n2-highmem-8',   label: 'High-mem XL — 8 vCPU · 64 GiB' },
      mem_2xl: { type: 'n2-highmem-16',  label: 'High-mem 2XL — 16 vCPU · 128 GiB' },
      mem_4xl: { type: 'n2-highmem-32',  label: 'High-mem 4XL — 32 vCPU · 256 GiB' },
      mem_8xl: { type: 'n2-highmem-64',  label: 'High-mem 8XL — 64 vCPU · 512 GiB' },
    },
    arm64: {
      small:   { type: 't2a-standard-1', label: 'Small — 1 vCPU · 4 GiB' },
      medium:  { type: 't2a-standard-2', label: 'Medium — 2 vCPU · 8 GiB' },
      large:   { type: 't2a-standard-4', label: 'Large — 4 vCPU · 16 GiB' },
      xlarge:  { type: 't2a-standard-8', label: 'XLarge — 8 vCPU · 32 GiB' },
      '2xl':   { type: 't2a-standard-16', label: '2XLarge — 16 vCPU · 64 GiB' },
      '4xl':   { type: 't2a-standard-32', label: '4XLarge — 32 vCPU · 128 GiB' },
      '8xl':   { type: 't2a-standard-48', label: '8XLarge — 48 vCPU · 192 GiB' },
    },
  },
};

export const SIZE_ORDER = [
  'tiny', 'small', 'medium', 'large', 'xlarge', '2xl', '4xl', '8xl', '16xl',
  'mem_l', 'mem_xl', 'mem_2xl', 'mem_4xl', 'mem_8xl',
];

export const GPU_PRESETS = {
  aws: [
    { id: 'g4dn-xl',   label: 'NVIDIA T4 · g4dn.xlarge (4 vCPU · 16 GiB)',     instance: 'g4dn.xlarge' },
    { id: 'g4dn-2xl',  label: 'NVIDIA T4 · g4dn.2xlarge (8 vCPU · 32 GiB)',    instance: 'g4dn.2xlarge' },
    { id: 'g4dn-4xl',  label: 'NVIDIA T4 · g4dn.4xlarge (16 vCPU · 64 GiB)',   instance: 'g4dn.4xlarge' },
    { id: 'g4dn-12xl', label: '4× NVIDIA T4 · g4dn.12xlarge (48 vCPU · 192 GiB)', instance: 'g4dn.12xlarge' },
    { id: 'g5-xl',     label: 'NVIDIA A10G · g5.xlarge (4 vCPU · 16 GiB)',     instance: 'g5.xlarge' },
    { id: 'g5-2xl',    label: 'NVIDIA A10G · g5.2xlarge (8 vCPU · 32 GiB)',    instance: 'g5.2xlarge' },
    { id: 'g5-4xl',    label: 'NVIDIA A10G · g5.4xlarge (16 vCPU · 64 GiB)',   instance: 'g5.4xlarge' },
    { id: 'g5-12xl',   label: '4× NVIDIA A10G · g5.12xlarge (48 vCPU · 192 GiB)', instance: 'g5.12xlarge' },
    { id: 'g6-xl',     label: 'NVIDIA L4 · g6.xlarge (4 vCPU · 16 GiB)',       instance: 'g6.xlarge' },
    { id: 'g6-2xl',    label: 'NVIDIA L4 · g6.2xlarge (8 vCPU · 32 GiB)',      instance: 'g6.2xlarge' },
    { id: 'g6-4xl',    label: 'NVIDIA L4 · g6.4xlarge (16 vCPU · 64 GiB)',     instance: 'g6.4xlarge' },
    { id: 'g6-12xl',   label: '4× NVIDIA L4 · g6.12xlarge (48 vCPU · 192 GiB)', instance: 'g6.12xlarge' },
    { id: 'p3-2xl',    label: 'NVIDIA V100 · p3.2xlarge (8 vCPU · 61 GiB)',    instance: 'p3.2xlarge' },
    { id: 'p4d-24xl',  label: '8× NVIDIA A100 · p4d.24xlarge (96 vCPU · 1152 GiB)', instance: 'p4d.24xlarge' },
  ],
  azure: [
    { id: 't4',  label: 'NVIDIA T4 · NC4as_T4_v3 (4 vCPU · 28 GiB)',  instance: 'Standard_NC4as_T4_v3' },
    { id: 't4l', label: 'NVIDIA T4 · NC8as_T4_v3 (8 vCPU · 56 GiB)',  instance: 'Standard_NC8as_T4_v3' },
    { id: 'a10', label: 'NVIDIA A10 · NV6ads_A10_v5 (6 vCPU · 55 GiB)', instance: 'Standard_NV6ads_A10_v5' },
    { id: 'a100', label: 'NVIDIA A100 · NC24ads_A100_v4 (24 vCPU · 220 GiB)', instance: 'Standard_NC24ads_A100_v4' },
  ],
  gcp: [
    { id: 'l4-4',    label: 'NVIDIA L4 · g2-standard-4 (4 vCPU · 16 GiB)',    instance: 'g2-standard-4',  gpu: 'nvidia-l4' },
    { id: 'l4-8',    label: 'NVIDIA L4 · g2-standard-8 (8 vCPU · 32 GiB)',    instance: 'g2-standard-8',  gpu: 'nvidia-l4' },
    { id: 'l4-16',   label: 'NVIDIA L4 · g2-standard-16 (16 vCPU · 64 GiB)',  instance: 'g2-standard-16', gpu: 'nvidia-l4' },
    { id: 't4',      label: 'NVIDIA T4 · n1-standard-4 (4 vCPU · 15 GiB)',    instance: 'n1-standard-4',  gpu: 'nvidia-tesla-t4' },
    { id: 'a100-1g', label: 'NVIDIA A100 · a2-highgpu-1g (12 vCPU · 85 GiB)', instance: 'a2-highgpu-1g',  gpu: 'nvidia-tesla-a100' },
    { id: 'a100-2g', label: '2× NVIDIA A100 · a2-highgpu-2g (24 vCPU · 170 GiB)', instance: 'a2-highgpu-2g', gpu: 'nvidia-tesla-a100' },
  ],
};

// Verified Canonical AMIs (owner 099720109477) + Windows marketplace + DLAMI
export const AWS_AMIS = {
  'ubuntu-2204': {
    x86_64: {
      'us-east-1': 'ami-04680790a315cd58d',
      'eu-west-1': 'ami-09d0c9a85bf1b9ea7',
    },
    arm64: {
      'us-east-1': 'ami-028f4acf86df833a8',
    },
  },
  'ubuntu-2404': {
    x86_64: {
      'us-east-1': 'ami-0ec10929233384c7f',
    },
  },
  'windows-2022': {
    x86_64: {
      'us-east-1': 'ami-05856bd26dd466893',
    },
  },
};

export const AWS_GPU_AMIS = {
  'eu-west-1': 'ami-0937fe84c877c359f',
};

export const AZURE_IMAGES = {
  'ubuntu-2204': {
    x86_64: {
      publisher: 'Canonical',
      offer: '0001-com-ubuntu-server-jammy',
      sku: '22_04-lts-gen2',
      version: 'latest',
    },
    arm64: 'Canonical:ubuntu-24_04-lts:minimal-arm64:latest',
  },
  'ubuntu-2404': {
    x86_64: 'Canonical:ubuntu-24_04-lts:server:latest',
    arm64: 'Canonical:ubuntu-24_04-lts:minimal-arm64:latest',
  },
};

export const GCP_IMAGES = {
  'ubuntu-2204': {
    x86_64: 'ubuntu-2204-jammy-v20260313',
    arm64: 'ubuntu-minimal-2204-jammy-arm64-v20260313',
  },
  'ubuntu-2404': {
    x86_64: 'ubuntu-2404-noble-amd64-v20260316',
    arm64: 'ubuntu-2404-noble-arm64-v20260316',
  },
};

// ----- On-Prem (cirun-agent) ---------------------------------------------

export const ON_PREM_OS = [
  { id: 'linux', label: 'Linux (KVM)', image: 'ubuntu:latest' },
  { id: 'macos', label: 'macOS (Apple Silicon)', image: 'cirunlabs/macos-sequoia-runner:latest' },
];

// instance_type follows the {vcpu}vcpu-{ram}gb-{disk}gb format
export const ON_PREM_SIZES = [
  { id: 'small',  type: '4vcpu-4gb-51gb',   label: 'Small — 4 vCPU · 4 GiB · 51 GB' },
  { id: 'medium', type: '8vcpu-8gb-75gb',   label: 'Medium — 8 vCPU · 8 GiB · 75 GB' },
  { id: 'large',  type: '8vcpu-16gb-100gb', label: 'Large — 8 vCPU · 16 GiB · 100 GB' },
];

// ----- Vast.ai -----------------------------------------------------------

export const VASTAI_GPUS = [
  { id: 'rtx4090',  type: '1xRTX_4090',      label: '1× RTX 4090' },
  { id: 'rtx4090x4', type: '4xRTX_4090',     label: '4× RTX 4090' },
  { id: 'a100',     type: '1xA100_SXM',      label: '1× A100 SXM' },
  { id: 'a100x4',   type: '4xA100_SXM',      label: '4× A100 SXM' },
  { id: 'h100',     type: '1xH100',          label: '1× H100' },
  { id: 'h100x2',   type: '2xH100',          label: '2× H100' },
];

export const VASTAI_MODES = [
  { id: 'container', label: 'Container', defaultImage: 'nvidia/cuda:12.0.0-base-ubuntu22.04' },
  { id: 'vm',        label: 'VM',        defaultImage: 'vastai/kvm:ubuntu_cli_22.04-2025-11-21' },
];
