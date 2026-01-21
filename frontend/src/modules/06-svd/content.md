# The Swiss Army Knife

Singular Value Decomposition (SVD) is arguably the most useful matrix factorization in history. It breaks **ANY** matrix into three parts:

$$ A = U \Sigma V^T $$

Rotation ($V^T$), Stretch ($\Sigma$), Rotation ($U$).

# Image Compression

An image is just a matrix of pixels. If we take its SVD, we find that most of the "energy" (information) is stored in the first few singular values.

By keeping only the top $k$ singular values, we can reconstruct the image with far less data. This is the basis of compression!

# Check Your Understanding

Is SVD only for square matrices?
