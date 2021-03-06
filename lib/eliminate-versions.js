'use strict';

function versionsToRemove(packageInfo, keep, skip) {
  const toRemove = [];

  packageInfo.versions.forEach((version, i) => {
    let keepVersion;

    if (version.version === skip) {
      return;
    }

    // Keep the version if it's not too old.
    // Cleaning mode: --keep-latest
    if (i >= packageInfo.versions.length - keep.latest) {
      keepVersion = true;
    }

    // Keep the version if it's in the list of scanned versions.
    // Cleaning mode: --keep-scanned
    if (keep.scanned) {
      const versions = keep.scanned[packageInfo.name];

      if (versions && versions[version.version]) {
        keepVersion = true;
      }
    }

    // Keep the version if it's not a pre-release.
    // Cleaning mode: --keep-final
    if (keep.final) {
      if (!version.isPreRelease) {
        keepVersion = true;
      }
    }

    if (!keepVersion) {
      toRemove.push(version);
    }
  });

  return toRemove;
}

// Returns an array of versions that should be removed, according to the
// cleaning modes provided in the options.
module.exports = function eliminateVersions(packagesData, options) {
  const packages = packagesData.packages;
  const toRemove = [];

  for (let name in packages) {
    let skip;

    if (name === 'meteor-tool') {
      skip = packagesData.toolVersion;
    }

    Array.prototype.push.apply(
      toRemove,
      versionsToRemove(packages[name], options, skip)
    );
  }

  return toRemove;
};
