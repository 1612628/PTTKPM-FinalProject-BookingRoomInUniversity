const colors = [
    'text-success',
    'text-warning',
    'text-danger',
    'text-primary',
    'text-secondary',
    'text-info',
]

export const getColorById = id => colors[id - 1]
export const PRIMARY_COLOR = '#2d7ff9'